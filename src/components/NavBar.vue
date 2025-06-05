<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { NButton } from 'naive-ui';
import { useThemeStore } from '@/stores/Theme';
import { NSwitch, NIcon } from 'naive-ui';
import { SunnyOutline, MoonOutline } from '@vicons/ionicons5';

const router = useRouter();
const auth = useAuthStore();
const themeStore = useThemeStore();

// Props & emits
const emit = defineEmits(['genreSelected', 'update:search']);
const { search, selectedGenre } = defineProps(['search', 'selectedGenre']);

// Local state
// 1) Bind the <input> to this ref, initialized from the prop `search`
const searchInput = ref(search);

// TMDB genre list
const genres = ref([]);
const mobileMenuOpen = ref(false);
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

let debounceTimer = null;

// Fetch genres once on mount
const getGenres = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: { api_key: API_KEY },
    });
    genres.value = data.genres;
  } catch (e) {
    console.error('Error fetching genres', e);
  }
};

// Breakpoint detector for desktop vs mobile
const isDesktop = ref(window.innerWidth >= 768);
function handleResize() {
  isDesktop.value = window.innerWidth >= 768;
}

// Auth & logout
auth.fetchUser();
const handleLogout = async () => {
  try {
    await auth.logout();
    mobileMenuOpen.value = false;
  } catch (e) {
    console.error(e);
  }
};

// ─── Lifecycle hooks ───
onMounted(() => {
  window.addEventListener('resize', handleResize);
  getGenres();
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  // Clear any pending debounce timer
  if (debounceTimer) clearTimeout(debounceTimer);
});

// ─── Debounced watcher ───
// Whenever `searchInput` changes (on every keystroke), reset a 500ms timeout.
// Only when 500ms have passed without new keystrokes do we emit `update:search`.
watch(searchInput, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('update:search', newVal.trim());
  }, 2000);
});

// Whenever selectedGenre changes (e.g. user clicks a genre), clear searchInput:
watch(
  () => selectedGenre,
  (g) => {
    if (g) {
      searchInput.value = '';
      // We also immediately emit an empty string, so parent resets its search:
      if (debounceTimer) clearTimeout(debounceTimer);
      emit('update:search', '');
    }
  },
);
</script>

<template>
  <nav
    class="bg-[var(--color-background)] text-[var(--color-text)] border-b border-[var(--color-border)]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- HEADER -->
      <header class="flex items-center justify-between py-4">
        <!-- Logo -->
        <h1 class="text-xl font-bold">Movie App</h1>

        <!-- Search input (debounced) -->
        <input
          v-model="searchInput"
          type="search"
          placeholder="Search..."
          class="w-40 sm:w-48 md:w-56 lg:w-64 px-4 py-2 rounded-full border-0 bg-[var(--color-background-soft)] text-[var(--color-text)] placeholder-[var(--color-text)] caret-[var(--color-text)] focus:outline-none"
        />

        <!-- DESKTOP NAV -->
        <div v-if="isDesktop" class="flex items-center gap-5">
          <RouterLink to="/favorites">Favorite</RouterLink>
          <RouterLink to="/watchlist">Watchlist</RouterLink>

          <!-- Theme toggle (sun/moon icon) -->
          <NButton quaternary @click="themeStore.toggleTheme">
            <NIcon size="25">
              <component :is="themeStore.theme === 'dark' ? MoonOutline : SunnyOutline" />
            </NIcon>
          </NButton>

          <div>
            <template v-if="auth.user">
              <div class="flex items-center gap-2">
                <img
                  src="https://img.freepik.com/premium-psd/smiling-3d-cartoon-man_975163-762.jpg?w=826"
                  class="w-8 h-8 rounded-full"
                />
                <button
                  @click="handleLogout"
                  class="px-3 py-1 bg-red-600 rounded text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </template>
            <template v-else>
              <RouterLink
                to="/login"
                class="px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700 transition-colors"
              >
                Login
              </RouterLink>
            </template>
          </div>
        </div>

        <!-- MOBILE MENU BUTTON -->
        <button v-else @click="mobileMenuOpen = !mobileMenuOpen" class="text-2xl ml-4">☰</button>
      </header>

      <!-- MOBILE DROPDOWN -->
      <div
        v-if="!isDesktop && mobileMenuOpen"
        class="mt-2 mb-4 flex items-center justify-center gap-5 flex-wrap"
      >
        <RouterLink to="/favorites">Favorite</RouterLink>
        <RouterLink to="/watchlist">Watchlist</RouterLink>

        <NButton quaternary @click="themeStore.toggleTheme">
          <NIcon size="25">
            <component :is="themeStore.theme === 'dark' ? MoonOutline : SunnyOutline" />
          </NIcon>
        </NButton>

        <div>
          <template v-if="auth.user">
            <div class="flex items-center gap-3">
              <img
                src="https://img.freepik.com/premium-psd/smiling-3d-cartoon-man_975163-762.jpg?w=826"
                class="w-8 h-8 rounded-full"
              />
              <button
                @click="handleLogout"
                class="px-3 py-1 bg-red-600 rounded text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700 transition-colors"
            >
              Login
            </RouterLink>
          </template>
        </div>
      </div>

      <!-- GENRE BAR -->
      <div class="mt-4 overflow-x-auto no-scrollbar">
        <ul class="flex items-center gap-2 whitespace-nowrap justify-start">
          <li>
            <NButton
              quaternary
              @click="emit('genreSelected', '')"
              :class="{ active: selectedGenre === '' }"
            >
              Home
            </NButton>
          </li>
          <li v-for="g in genres" :key="g.id">
            <NButton
              quaternary
              @click="emit('genreSelected', g.id)"
              :class="{ active: selectedGenre === g.id }"
            >
              {{ g.name }}
            </NButton>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.active {
  background-color: var(--color-background-mute);
  color: var(--color-text);
}
</style>
