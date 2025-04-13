<script setup>
import { RouterLink } from 'vue-router';
const { movies } = defineProps(['movies']);
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
</script>

<template>
  <div class="movie-list">
    <div v-for="movie in movies" :key="movie.id" class="movies">
      <RouterLink :to="`/movie/${movie.id}`">
        <img v-if="movie.poster_path" :src="`${IMAGE_BASE_URL}${movie.poster_path}`" alt="Poster" />
        <div class="moveies-title">
          <h1>{{ movie.original_title }}</h1>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  justify-content: center;
  margin-top: 30px;
}

.movies {
  width: 205px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 15px;
}

.movies img {
  width: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.moveies-title {
  text-align: center;
  color: white;
}
</style>
