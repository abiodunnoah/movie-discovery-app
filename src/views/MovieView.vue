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
const search = ref('');
const page = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);
const errorMsg = ref('');

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
    errorMsg.value = '';
  } catch (error) {
    console.error('Error fetching Movies', error);
    errorMsg.value = 'Failed to load movies. Please try again later.';
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

    <div v-else-if="errorMsg" class="flex flex-col items-center justify-center h-96 gap-4">
      <p class="text-red-500 text-lg">{{ errorMsg }}</p>
      <button
        @click="getMovies"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>

    <template v-else>
      <MovieCard :movies="movies" />

      <div class="flex justify-center items-center gap-4 pt-8 pb-12">
        <button
          class="button"
          @click="prevPage"
          :disabled="page === 1"
          :class="{ 'opacity-40 cursor-not-allowed': page === 1 }"
        >
          &lt;
        </button>
        <span class="text-sm">Page {{ page }} of {{ totalPages || 1 }}</span>
        <button
          class="button"
          @click="nextPage"
          :disabled="page >= totalPages"
          :class="{ 'opacity-40 cursor-not-allowed': page >= totalPages }"
        >
          &gt;
        </button>
      </div>
    </template>
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
