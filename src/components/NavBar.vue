<script setup>
import { ref, onMounted, watch } from 'vue';
// import { RouterLink } from 'vue-router';
import axios from 'axios';
import { NButton } from 'naive-ui';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const genres = ref([]);
const emit = defineEmits(['genreSelected']);
const { search, selectedGenre } = defineProps(['search', 'selectedGenre']);
const searchInput = ref(search);

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
  <nav class="text-white p-4">
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
            <p class="cursor-pointer">Watchlist</p>
          </div>
        </div>
        <div class="w-24">
          <img
            src="https://img.freepik.com/premium-psd/smiling-3d-cartoon-man_975163-762.jpg?w=826"
            alt="profile-image"
            class="w-10 rounded-3xl cursor-pointer"
          />
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
</style>
