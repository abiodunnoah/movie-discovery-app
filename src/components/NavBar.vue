<script setup>
import { ref, onMounted, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { NButton } from 'naive-ui';
import { useThemeStore } from '@/stores/Theme';
// import { useDark, useToggle } from '@vueuse/core';

const router = useRouter();
const auth = useAuthStore();
const themeStore = useThemeStore();

// const isDark = useDark({
//   selector: 'body',
//   attribute: 'color-scheme',
//   valueDark: 'dark',
//   valueLight: 'light',
// });

// const toggleDark = useToggle(isDark);

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const genres = ref([]);
const emit = defineEmits(['genreSelected']);
const { search, selectedGenre } = defineProps(['search', 'selectedGenre']);
const searchInput = ref(search);

auth.fetchUser();

const handleLogout = async () => {
  try {
    await auth.logout();
    // router.push('/login');
  } catch (e) {
    console.error('Logout failed:', e);
  }
};

const getGenres = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: { api_key: API_KEY },
    });
    genres.value = response.data.genres;
    console.log(response.data);
  } catch (error) {
    console.log('Error fetching genre', error);
  }
};

watch(searchInput, (newVal) => {
  emit('update:search', newVal);
});

watch(
  () => selectedGenre,
  (newVal) => {
    if (newVal) {
      searchInput.value = '';
    }
  },
);

onMounted(() => {
  getGenres();
});
</script>

<template>
  <nav class="p-4">
    <header>
      <div class="pt-5 flex justify-between pb-2 border-b-1 border-b-gray-500">
        <div class="w-5">
          <h1 class="text-xl font-bold">Movie App</h1>
        </div>
        <div>
          <input
            v-model="searchInput"
            type="search"
            placeholder="Search..."
            class="border-0 bg-blue-50 text-gray-800 p-1.5 rounded-3xl pr-5"
          />
        </div>
        <div class="flex">
          <div class="pr-3.5">
            <router-link to="/favorites">
              <p class="cursor-pointer">Favorite</p>
            </router-link>
          </div>
          <div>
            <router-link to="/watchlist">
              <p class="cursor-pointer">Watchlist</p>
            </router-link>
          </div>
        </div>
        <div>
          <label class="switch">
            <input
              type="checkbox"
              :checked="themeStore.theme === 'dark'"
              @change="themeStore.toggleTheme"
            />
            <span class="slider round"></span>
          </label>
        </div>
        <div v-if="auth.user" class="flex flex-col justify-center">
          <div class="w-24 pb-2 pl-4">
            <img
              src="https://img.freepik.com/premium-psd/smiling-3d-cartoon-man_975163-762.jpg?w=826"
              alt="profile-image"
              class="w-10 rounded-3xl cursor-pointer"
            />
          </div>
          <div>
            <button @click="handleLogout" class="px-3 py-1 bg-red-600 hover:bg-red-800 rounded">
              Logout
            </button>
          </div>
        </div>
        <div v-else>
          <router-link to="/login" class="px-3 py-1 bg-blue-600 hover:bg-blue-800 rounded"
            >Login</router-link
          >
        </div>
      </div>
    </header>
    <div class="container-genres">
      <ul class="flex">
        <n-button
          quaternary
          class="buttons"
          @click="emit('genreSelected', '')"
          :class="{ active: selectedGenre === '' || selectedGenre === null || searchInput !== '' }"
        >
          Home
        </n-button>
        <li v-for="genre in genres" :key="genre.id">
          <n-button
            quaternary
            @click="emit('genreSelected', genre.id)"
            class="buttons"
            :class="{ active: selectedGenre === genre.id }"
          >
            {{ genre.name }}
          </n-button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
::placeholder {
  padding-left: 15px;
}

.header {
  color: white;
  font-size: 20px;
}

.buttons {
  color: white;
  cursor: pointer;
  margin-left: 8px;
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.3s;
}

.buttons.active {
  background-color: #214368;
  color: #4b9ffa;
}

/* .buttons.active {
  background-color: #007bff;
  color: white;
} */

.container-genres {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin-top: 10px;
}

.container-genres::-webkit-scrollbar {
  display: none;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

/*
[color-scheme='dark'] {
  background-color: rgb(57, 57, 57);
}

[color-scheme='light'] {
  background-color: rgb(255, 255, 255);
} */
</style>
