<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';
import MovieCard from '@/components/MovieCard.vue';

// TMDB configuration
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const movies = ref([]);
const selectedGenre = ref('');
const search = ref(''); // ← this will be updated by NavBar (after debounce)
const page = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);

const getMovies = async () => {
  isLoading.value = true;
  try {
    // Decide endpoint based on whether `search` is empty
    const endpoint = search.value ? `${BASE_URL}/search/movie` : `${BASE_URL}/discover/movie`;

    const response = await axios.get(endpoint, {
      params: {
        api_key: API_KEY,
        with_genres: selectedGenre.value || '',
        query: search.value || '',
        page: page.value,
      },
    });
    movies.value = response.data.results;
    totalPages.value = response.data.total_pages;
  } catch (error) {
    console.error('Error fetching Movies', error);
  } finally {
    isLoading.value = false;
  }
};

// Whenever `selectedGenre` or the (already debounced) `search` changes, refetch:
watch([selectedGenre, search], ([newSearch]) => {
  // If user typed a new search string, clear any genre filter:
  if (newSearch && newSearch.length > 0) {
    selectedGenre.value = '';
  }
  page.value = 1;
  getMovies();
});

// Pagination watcher
watch(page, getMovies);

// Initial load
onMounted(getMovies);

const nextPage = () => {
  if (page.value < totalPages.value) page.value++;
};
const prevPage = () => {
  if (page.value > 1) page.value--;
};
</script>

<template>
  <main>
    <!-- Bind `search` directly to NavBar. NavBar will emit update:search only after 500 ms. -->
    <NavBar
      v-model:search="search"
      @genreSelected="(id) => (selectedGenre = id)"
      :selectedGenre="selectedGenre"
    />

    <div v-if="isLoading" class="flex justify-center h-96">
      <NSpin size="large" />
    </div>

    <MovieCard :movies="movies" />

    <div class="flex justify-center pt-8 pb-12">
      <button class="button" @click="prevPage" :disabled="page === 1">&lt;</button>
      <button class="button" @click="nextPage" :disabled="page >= totalPages">&gt;</button>
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
  cursor: pointer;
  background: rgba(221, 220, 220, 0.5);
  color: black;
}
</style>
