<script setup>
import { RouterLink } from 'vue-router';
const { movies } = defineProps(['movies']);
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
</script>

<template>
  <div class="movie-list">
    <div v-for="movie in movies" :key="movie.id" class="movie-card">
      <RouterLink :to="`/movie/${movie.id}`" class="block w-full h-full">
        <img
          v-if="movie.poster_path"
          :src="`${IMAGE_BASE_URL}${movie.poster_path}`"
          alt="Poster"
          class="movie-img"
        />
        <div class="movie-title">
          <h1>{{ movie.original_title }}</h1>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

/* Card background uses your “soft” surface color */
.movie-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--color-background-soft);
  transition: transform 0.2s;
  cursor: pointer;
}

.movie-card:hover {
  transform: scale(1.02);
}

.movie-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
}

/* Title text uses your theme’s text color */
.movie-title {
  text-align: center;
  padding: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
}

/* Make title slightly smaller on very small screens */
@media (max-width: 480px) {
  .movie-title {
    font-size: 0.8rem;
  }
}
</style>
