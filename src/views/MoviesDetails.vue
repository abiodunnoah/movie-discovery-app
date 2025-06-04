<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useUserDataStore } from '@/stores/userData';
import { auth } from '@/Firebase';
import { NButton, NSpin } from 'naive-ui';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const route = useRoute();
const router = useRouter();
const movie = ref(null);
const credit = ref({ cast: [], crew: [] });
const isLoading = ref(false);
const userData = useUserDataStore();
const errorMsg = ref('');

// Fetch movie details + credits
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
  } catch (error) {
    console.error('Error getting movie details', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(getMovieDetails);

// Compute stars
const fullStars = computed(() => Math.floor((movie.value?.vote_average || 0) / 2));
const hasHalfStar = computed(() => ((movie.value?.vote_average || 0) / 2) % 1 >= 0.5);
const emptyStars = computed(() => 5 - fullStars.value - (hasHalfStar.value ? 1 : 0));

// Toggle favorites/watchlist
const toggleFavorite = () => {
  if (!auth.currentUser) {
    errorMsg.value = 'You must be logged in to add to favorites.';
    return;
  }
  errorMsg.value = '';
  userData.toggleFavorite(movie.value);
};

const toggleWatchlist = () => {
  if (!auth.currentUser) {
    errorMsg.value = 'You must be logged in to add to watchlist.';
    return;
  }
  errorMsg.value = '';
  userData.toggleWatchlist(movie.value);
};
</script>

<template>
  <div class="details-container">
    <!-- Loading spinner -->
    <div v-if="isLoading" class="spinner-wrapper">
      <NSpin size="large" />
    </div>

    <div v-else-if="movie" class="content-wrapper">
      <!-- Poster + Basic Info -->
      <div class="movie-main-info">
        <!-- Poster -->
        <div class="poster-wrapper">
          <img
            v-if="movie.poster_path"
            :src="`${IMAGE_BASE_URL}${movie.poster_path}`"
            alt="Poster"
            class="poster-img"
          />
        </div>

        <!-- Info -->
        <div class="info-wrapper">
          <h1 class="movie-title">{{ movie.original_title }}</h1>

          <div class="action-buttons">
            <button @click="toggleFavorite" class="icon-button">
              <i :class="['fa-heart', userData.isFavorite(movie.id) ? 'fas' : 'far']"></i>
            </button>
            <button @click="toggleWatchlist" class="icon-button">
              <i :class="['fa-bookmark', userData.isWatchlist(movie.id) ? 'fas' : 'far']"></i>
            </button>
          </div>

          <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>

          <p class="overview"><strong>Overview:</strong> {{ movie.overview }}</p>
          <p class="meta-text">
            <strong>Genres:</strong>
            {{ movie.genres.map((g) => g.name).join(', ') }}
          </p>
          <p class="meta-text"><strong>Release Date:</strong> {{ movie.release_date }}</p>

          <!-- Star rating -->
          <div class="rating-wrapper">
            <i v-for="n in fullStars" :key="'full-' + n" class="fas fa-star star-full"></i>
            <i v-if="hasHalfStar" class="fas fa-star-half-alt star-full"></i>
            <i v-for="n in emptyStars" :key="'empty-' + n" class="far fa-star star-empty"></i>
          </div>
        </div>
      </div>

      <!-- Cast Section -->
      <h2 class="section-heading">Cast</h2>
      <div v-if="credit.cast && credit.cast.length" class="cast-grid">
        <div v-for="person in credit.cast.slice(0, 10)" :key="person.cast_id" class="cast-card">
          <img
            v-if="person.profile_path"
            :src="`${IMAGE_BASE_URL}${person.profile_path}`"
            alt="Profile Image"
            class="cast-img"
          />
          <p class="cast-name">{{ person.name }}</p>
          <p class="cast-role">{{ person.character }}</p>
        </div>
      </div>

      <div class="back-btn-wrapper">
        <NButton secondary @click="router.back()">Back</NButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container that wraps everything */
.details-container {
  /* Use your theme’s background color */
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 1rem;
  min-height: 100vh;
}

/* Center spinner while loading */
.spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

/* Main content wrapper: stacks on mobile, side-by-side on desktop */
.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Poster + Info wrapper */
.movie-main-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

/* Poster container */
.poster-wrapper {
  flex-shrink: 0;
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  overflow: hidden;
  background-color: var(--color-background-soft); /* subtle container bg */
}

.poster-img {
  width: 100%;
  height: auto;
  display: block;
}

/* Info side: on desktop, sit alongside poster */
.info-wrapper {
  width: 100%;
  max-width: 600px;
  background-color: var(--color-background-soft);
  border-radius: 20px;
  padding: 2rem;
  /* text-align: center; */
  transition: transform 0.2s;
}

/* Movie title */
.movie-title {
  font-size: 1.75rem;
  text-align: center;
  margin-bottom: 1rem;
}

/* Action buttons (favorite/watchlist) */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--color-text); /* icon inherits text color */
}

/* If you want the heart/bookmark icons colored specially, add a small override: */
.icon-button .fas.fa-heart,
.icon-button .far.fa-heart {
  color: #e50914; /* red heart color stays constant */
}
.icon-button .fas.fa-bookmark,
.icon-button .far.fa-bookmark {
  color: #f0c14b; /* amber bookmark color stays constant */
}
/* Error message */
.error-text {
  color: #e74c3c;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  transition: opacity 0.3s ease;
}

/* Overview and meta text */
.overview,
.meta-text {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  text-align: center;
}

/* Star rating container */
.rating-wrapper {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.star-full {
  color: #ffd700;
  font-size: 1.25rem;
}
.star-empty {
  color: var(--color-text); /* use theme’s text color (muted by opacity below) */
  opacity: 0.5;
  font-size: 1.25rem;
}

/* Cast heading */
.section-heading {
  font-size: 1.5rem;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

/* Cast grid: adjusts from 1 to many columns */
.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  justify-items: center;
}

/* Individual cast cards */
.cast-card {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  width: 100%;
  max-width: 180px;
  transition: transform 0.2s;
  cursor: pointer;
}

.cast-card:hover {
  transform: scale(1.03);
}

.cast-img {
  width: 100%;
  height: auto;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.cast-name {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--color-text);
}
.cast-role {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.8;
}

/* Back button wrapper */
.back-btn-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

/* -------------------------------
   RESPONSIVE ADJUSTMENTS
---------------------------------*/

/* On medium screens (≥768px): place poster & info side by side */
@media (min-width: 768px) {
  .movie-main-info {
    flex-direction: row;
    align-items: flex-start;
    gap: 2rem;
  }
  .movie-title,
  .overview,
  .meta-text {
    text-align: left;
  }
  .action-buttons {
    justify-content: flex-start;
  }
}

/* On large screens (≥1024px): increase spacing & font sizes */
@media (min-width: 1024px) {
  .details-container {
    padding: 2rem;
  }
  .movie-title {
    font-size: 2rem;
  }
  .overview,
  .meta-text {
    font-size: 1.125rem;
  }
  .section-heading {
    font-size: 1.75rem;
  }
}
</style>
