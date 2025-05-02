<script setup>
import { useRouter } from 'vue-router';
import { useUserDataStore } from '@/stores/userData';
// import { useFavoritesStore } from '@/stores/favourites';

const router = useRouter();
const user = useUserDataStore();
// const favoritesStore = useFavoritesStore();

const getPoster = (path) => `https://image.tmdb.org/t/p/w500${path}`;

const deleteFavorite = (id) => {
  user.removeFavorite(id);
};
</script>

<template>
  <div class="pt-5 pb-12 text-white">
    <h1 class="pb-5 text-2xl flex justify-center">My Favorite</h1>
    <div v-if="user.favorites.length === 0" class="no-text">
      <p>No Favorite List Available</p>
    </div>
    <div v-else class="favorite-container">
      <div v-for="movie in user.favorites" :key="movie.id" class="favorite-card">
        <div class="w-[200px]">
          <router-link :to="`/movie/${movie.id}`">
            <img :src="getPoster(movie.poster_path)" alt="Movie Poster" class="rounded-2xl" />
          </router-link>
        </div>
        <div class="pt-2">
          <h1 class="text-sm">{{ movie.original_title }}</h1>
        </div>
        <div class="pt-4 pb-4">
          <button
            @click="deleteFavorite(movie.id)"
            class="w-fit bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded"
          >
            Remove from Favorites
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-center pt-10">
      <NButton secondary type="info" @click="router.back()">Back</NButton>
    </div>
  </div>
</template>

<style scoped>
.favorite-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  justify-content: center;
  margin-top: 30px;
}

.favorite-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-bottom: 25px;
}

.no-text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: grey;
}
</style>
