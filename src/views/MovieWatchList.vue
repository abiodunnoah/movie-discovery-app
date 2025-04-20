<script setup>
import { useRouter } from 'vue-router';
import { useWatchlistStore } from '@/stores/WatchList';

const router = useRouter();
const watchStore = useWatchlistStore();
const getPoster = (path) => `https://image.tmdb.org/t/p/w500${path}`;

const deleteWatchlist = (id) => {
  watchStore.removeWatchlist(id);
};
</script>

<template>
  <div class="pt-5 pb-12 text-white">
    <h1 class="pb-5 text-2xl flex justify-center">My Watchlist</h1>
    <div v-if="watchStore.watchlist.length === 0" class="no-text">
      <p>No Watchlist List Available</p>
    </div>
    <div v-else class="watch-container">
      <div v-for="movie in watchStore.watchlist" :key="movie.id" class="watch-card">
        <div class="w-[200px]">
          <router-link :to="`/movie/${movie.id}`">
            <img :src="getPoster(movie.poster_path)" alt="Movie Poster" class="rounded-2xl" />
          </router-link>
        </div>
        <div class="pt-2">
          <h1 class="text-xl">{{ movie.original_title }}</h1>
        </div>
        <div class="pt-4 pb-4">
          <button
            @click="deleteWatchlist(movie.id)"
            class="w-fit bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded"
          >
            Remove from Watchlist
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
.no-text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: grey;
}

.watch-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  justify-content: center;
  margin-top: 30px;
}

.watch-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-bottom: 25px;
}
</style>
