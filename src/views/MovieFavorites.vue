<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useUserDataStore } from '@/stores/userData';

const router = useRouter();
const user = useUserDataStore();
const isCheckingAuth = ref(true);

// Helper to build full poster URL
const getPoster = (path) => `https://image.tmdb.org/t/p/w500${path}`;

// Remove from favorites
const deleteFavorite = (id) => {
  user.removeFavorite(id);
};

onMounted(() => {
  const auth = getAuth();
  // Wait for auth state to be determined
  const unSubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      // User is authenticated, load their data
      isCheckingAuth.value = false;
    } else {
      // User is not authenticated, redirect to login
      isCheckingAuth.value = false;
      router.replace({ name: 'Login' });
    }
    unSubscribe(); // Clean up listener
  });
});
</script>

<template>
  <!-- Show loading state while checking auth -->
  <div v-if="isCheckingAuth" class="flex justify-center items-center min-h-screen">
    <p>Loading...</p>
  </div>

  <!-- Main content -->
  <div v-else class="favorites-root">
    <h1 class="favorites-title">My Favorites</h1>

    <!-- Empty state -->
    <div v-if="!user.favorites.length" class="empty-state">
      <p>No favorites yet.</p>
    </div>

    <!-- Favorites grid -->
    <div v-else class="favorites-grid">
      <div v-for="movie in user.favorites" :key="movie.id" class="favorite-item">
        <router-link :to="`/movie/${movie.id}`" class="poster-link">
          <img :src="getPoster(movie.poster_path)" alt="Movie Poster" class="poster-img" />
        </router-link>

        <h2 class="movie-name">{{ movie.original_title }}</h2>

        <button class="remove-btn" @click="deleteFavorite(movie.id)">Remove</button>
      </div>
    </div>

    <!-- Back button -->
    <div class="back-button-container">
      <button class="back-btn" @click="router.back()">Back</button>
    </div>
  </div>
</template>

<style scoped>
/* Root wrapper */
.favorites-root {
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 16px;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Page title */
.favorites-title {
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
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

/* At ≥ 600px: 2 columns */
@media (min-width: 600px) {
  .favorites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* At ≥ 900px: 3 columns */
@media (min-width: 900px) {
  .favorites-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* At ≥ 1200px: 4 columns */
@media (min-width: 1200px) {
  .favorites-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Individual favorite item */
.favorite-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.favorite-item:hover {
  transform: scale(1.02);
}

/* Poster link wrapper to make full-width image clickable */
.poster-link {
  width: 100%;
  display: block;
}

/* Poster image */
.poster-img {
  width: 100%;
  height: auto;
  object-fit: cover;
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
  transition: background-color 0.2s;
}

.remove-btn:hover {
  background-color: darken(var(--color-accent), 10%);
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
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
