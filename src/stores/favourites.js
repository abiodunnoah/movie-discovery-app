import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  }),
  actions: {
    toggleFavorite(movie) {
      const index = this.favorites.findIndex((m) => m.id === movie.id);
      if (index === -1) {
        this.favorites.push(movie);
      } else {
        this.favorites.splice(index, 1);
      }
      this.saveToLocalStorage();
    },
    isFavorite(movieId) {
      return this.favorites.some((m) => m.id === movieId);
    },
    removeFavorite(movieId) {
      this.favorites = this.favorites.filter((movie) => movie.id !== movieId);
      this.saveToLocalStorage;
    },
    saveToLocalStorage() {
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
  },
});
