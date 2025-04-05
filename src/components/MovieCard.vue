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
          <h3>{{ movie.original_title }}</h3>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  /* gap: 5px; */
  justify-content: center;
  /* padding: 1rem; */
  margin-top: 30px;
}

.movies {
  width: 205px;
  /* height: 250px; */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* line-height: 50px; */
  cursor: pointer;
  margin-bottom: 30px;
}

.movies img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.moveies-title {
  text-align: center;
  color: white;
}
</style>
