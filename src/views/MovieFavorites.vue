<script setup>
import { useRouter } from 'vue-router';
import { useUserDataStore } from '@/stores/userData';

const router = useRouter();
const user = useUserDataStore();

const getPoster = (path) => `https://image.tmdb.org/t/p/w500${path}`;

const deleteFavorite = (id) => {
  user.removeFavorite(id);
};
</script>

<template>
  <div class="pt-5 pb-12 text-white px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-semibold text-center mb-6">My Favorites</h1>

    <!-- Empty state -->
    <div v-if="!user.favorites.length" class="flex items-center justify-center h-64 text-gray-400">
      <p>No favorites yet.</p>
    </div>

    <!-- Responsive grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="movie in user.favorites" :key="movie.id" class="flex flex-col items-center">
        <router-link :to="`/movie/${movie.id}`" class="w-full">
          <img
            :src="getPoster(movie.poster_path)"
            alt="Movie Poster"
            class="rounded-2xl shadow-lg transition-transform hover:scale-105"
          />
        </router-link>
        <h2 class="mt-3 text-center text-base font-medium line-clamp-2">
          {{ movie.original_title }}
        </h2>
        <button
          @click="deleteFavorite(movie.id)"
          class="mt-4 px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 rounded-full transition-colors"
        >
          Remove
        </button>
      </div>
    </div>

    <!-- Back button -->
    <div class="flex justify-center mt-12">
      <NButton secondary type="info" @click="router.back()"> Back </NButton>
    </div>
  </div>
</template>

<style scoped>
/* Optional: clamp titles to two lines with ellipsis */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
