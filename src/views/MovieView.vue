<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';
import MovieCard from '@/components/MovieCard.vue';
import { auth } from '@/Firebase';

// const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const movies = ref(null);
const selectedGenre = ref(null);
const search = ref('');
const page = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);

const getMovies = async () => {
  isLoading.value = true;
  try {
    const endPoint = search.value ? `${BASE_URL}/search/movie` : `${BASE_URL}/discover/movie`;

    const response = await axios.get(endPoint, {
      params: {
        api_key: API_KEY,
        with_genres: selectedGenre.value || '',
        query: search.value || '',
        page: page.value,
      },
    });
    movies.value = response.data.results;
    totalPages.value = response.data.total_pages;
    console.log(response.data);
  } catch (error) {
    console.log('Error fetching Movies', error);
  } finally {
    isLoading.value = false;
  }
};

watch([selectedGenre, search], ([, newSearch]) => {
  if (newSearch.trim() !== '') {
    selectedGenre.value = '';
  }
  page.value = 1;
  getMovies();
});

watch(page, getMovies);

const nextPage = () => {
  if (page.value < totalPages.value) page.value++;
};

const prevPage = () => {
  if (page.value > 1) page.value--;
};

onMounted(() => {
  getMovies();
});
</script>

<template>
  <main>
    <NavBar
      v-model:search="search"
      @genreSelected="(id) => (selectedGenre = id)"
      :selectedGenre="selectedGenre"
    />

    <div v-if="isLoading" class="flex justify-center h-96">
      <NSpin size="large" />
    </div>

    <div>
      <MovieCard :movies="movies" />
    </div>

    <div class="flex justify-center pt-8 pb-12">
      <button class="button" @click="prevPage" :disabled="page === 1">&lt;</button>
      <button class="button" @click="nextPage" :disabled="page >= totalPages">></button>
    </div>
  </main>
</template>

<style scoped>
.button {
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin: 0 5px;
  cursor: point;
  background: white;
  color: black;
}
</style>
