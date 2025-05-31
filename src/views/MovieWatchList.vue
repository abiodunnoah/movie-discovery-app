<script setup>
import { useRouter } from 'vue-router';
import { useUserDataStore } from '@/stores/userData';

const router = useRouter();
const user = useUserDataStore();

// Build full poster URL
const getPoster = (path) => `https://image.tmdb.org/t/p/w500${path}`;

// Remove a movie from watchlist
const deleteWatchlist = (id) => {
  user.removeWatchlist(id);
};
</script>

<template>
  <!-- Root container uses theme background & text colors -->
  <div class="watchlist-root">
    <h1 class="watchlist-title">My Watchlist</h1>

    <!-- Empty state -->
    <div v-if="!user.watchlist.length" class="empty-state">
      <p>No Watchlist List Available</p>
    </div>

    <!-- Responsive grid of watchlist items -->
    <div v-else class="watchlist-grid">
      <div v-for="movie in user.watchlist" :key="movie.id" class="watchlist-item">
        <div class="poster-wrapper">
          <router-link :to="`/movie/${movie.id}`" class="poster-link">
            <img :src="getPoster(movie.poster_path)" alt="Movie Poster" class="poster-img" />
          </router-link>
        </div>

        <h2 class="movie-name">{{ movie.original_title }}</h2>

        <button class="remove-btn" @click="deleteWatchlist(movie.id)">Remove from Watchlist</button>
      </div>
    </div>

    <!-- Back button -->
    <div class="back-button-container">
      <button class="back-btn" @click="router.back()">Back</button>
    </div>
  </div>
</template>

<style scoped>
.watchlist-root {
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 16px;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Page title */
.watchlist-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
}

/* Empty state styling */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.empty-state p {
  color: var(--color-text-muted);
  font-size: 16px;
}

/* Grid container */
.watchlist-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

/* At ≥ 600px: 2 columns */
@media (min-width: 600px) {
  .watchlist-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* At ≥ 900px: 3 columns */
@media (min-width: 900px) {
  .watchlist-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* At ≥ 1200px: 4 columns */
@media (min-width: 1200px) {
  .watchlist-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Individual watchlist item */
.watchlist-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.watchlist-item:hover {
  transform: scale(1.02);
}

/* Poster wrapper for clickable image */
.poster-wrapper {
  width: 100%;
  overflow: hidden;
}

.poster-link {
  display: block;
  width: 100%;
}

.poster-img {
  width: 100%;
  height: auto;
  display: block;
}

/* Movie title below the poster */
.movie-name {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin: 12px 8px 8px 8px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* limit to 2 lines */
  -webkit-box-orient: vertical;
  line-height: 1.2em;
  max-height: 2.4em; /* 2 lines × 1.2em */
}

/* Remove button styling */
.remove-btn {
  margin-bottom: 16px;
  padding: 8px 16px;
  background-color: var(--color-accent);
  color: #ffffff;
  border: none;
  border-radius: 9999px;
  font-size: 14px;
  cursor: pointer;
  transition: filter 0.2s;
}

.remove-btn:hover {
  filter: brightness(0.9);
}

/* Back button container */
.back-button-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* Back button styling */
.back-btn {
  padding: 10px 20px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: filter 0.2s;
}

.back-btn:hover {
  filter: brightness(0.9);
}
</style>
