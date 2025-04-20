<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useFavoritesStore } from '@/stores/favourites';
import { useWatchlistStore } from '@/stores/WatchList';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const route = useRoute();
const router = useRouter();
const movie = ref(null);
const credit = ref({ cast: [], crew: [] });
const isLoading = ref(false);
const favoritesStore = useFavoritesStore();
const WatchlistStore = useWatchlistStore();

const getMovieDetails = async () => {
  isLoading.value = true;
  try {
    const [movieRes, creditRes] = await Promise.all([
      axios.get(`${BASE_URL}/movie/${route.params.id}`, {
        params: { api_key: API_KEY },
      }),
      axios.get(`${BASE_URL}/movie/${route.params.id}/credits`, {
        params: { api_key: API_KEY },
      }),
    ]);
    movie.value = movieRes.data;
    credit.value = creditRes.data;
    console.log(creditRes.data);
  } catch (error) {
    console.log('Error Getting Movies Details', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(getMovieDetails);

const fullStars = computed(() => Math.floor(movie.value?.vote_average / 2));
const hasHalfStar = computed(() => (movie.value?.vote_average / 2) % 1 >= 0.5);
const emptyStars = computed(() => 5 - fullStars.value - (hasHalfStar.value ? 1 : 0));
</script>

<template>
  <div class="pt-4 text-white pb-16 flex justify-center flex-col">
    <div v-if="isLoading" class="flex justify-center h-96">
      <NSpin size="large" />
    </div>

    <div v-if="movie">
      <div class="image-container">
        <img :src="`${IMAGE_BASE_URL}${movie.poster_path}`" alt="Poster" />
      </div>
      <h1 class="flex justify-center text-2xl pb-3.5">{{ movie.original_title }}</h1>
      <div class="flex pb-3">
        <div class="pr-5">
          <button
            class="bg-black p-1.5 rounded-md border-1 cursor-pointer"
            @click="favoritesStore.toggleFavorite(movie)"
          >
            Favorite
            <font-awesome-icon
              :icon="[favoritesStore.isFavorite(movie.id) ? 'fas' : 'far', 'heart']"
              class="icon"
            />
          </button>
        </div>
        <div>
          <button class="bg-black p-1.5 rounded-md border-1 cursor-pointer">
            Watchlist
            <font-awesome-icon
              :icon="[WatchlistStore.isWatchlist(movie.id) ? 'fas' : 'far', 'bookmark']"
              @click="WatchlistStore.toggleWatch(movie)"
              class="cursor-pointer text-amber-400 text-2xl"
            />
          </button>
        </div>
      </div>
      <h2 class="text-xl">Overview :</h2>
      <p class="pb-3.5">{{ movie.overview }}</p>
      <p class="pb-3.5">
        <span class="text-xl">Genres:</span>
        {{ movie.genres.map((g) => g.name).join(', ') }}
      </p>
      <p class="pb-3.5"><span class="text-xl">Release Date:</span> {{ movie.release_date }}</p>

      <div
        style="background-color: #121212; padding: 20px; border-radius: 10px; margin-bottom: 30px"
      >
        <p class="font-bold text-xl">Rating:</p>
        <div class="text-xl pr">
          <i
            v-for="n in fullStars"
            :key="'full-' + n"
            class="fas fa-star"
            style="color: #ffd700"
          ></i>
          <i v-if="hasHalfStar" class="fas fa-star-half-alt" style="color: #ffd700"></i>
          <i
            v-for="n in emptyStars"
            :key="'empty-' + n"
            class="far fa-star"
            style="color: #555555"
          ></i>
        </div>
      </div>
    </div>

    <!-- Crew -->
    <h2 class="flex justify-center text-2xl">Cast</h2>
    <div v-if="credit.cast && credit.cast.length" class="cast-container">
      <div v-for="person in credit.cast.slice(0, 10)" :key="person.cast_id" class="cast-details">
        <img
          v-if="person.profile_path"
          :src="`${IMAGE_BASE_URL}${person.profile_path}`"
          alt="Profile Image"
          class="rounded-xl"
        />
        <p>{{ person.name }}</p>
        <p>{{ person.character }}</p>
      </div>
    </div>
    <NButton secondary type="info" @click="router.back()" class="button">Back</NButton>
  </div>
</template>

<style scoped>
/* .fa-stars {
  font-size: 20px;
  margin-right: 8px;
} */

.image-container {
  display: flex;
  justify-content: center;
  background-color: black;
  padding: 20px;
  border-radius: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
}

/* span {
  font-size: 18px;
  font-weight: 500;
} */

.cast-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 50px;
}

.cast-details {
  width: 180px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 30px;
}

.button {
  padding: 25px;
  margin-top: 20px;
}

.icon {
  color: red;
  font-size: 20px;
  cursor: pointer;
}
</style>
