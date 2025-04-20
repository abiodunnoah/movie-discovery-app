import { defineStore } from 'pinia';

export const useWatchlistStore = defineStore('watchlist', {
  state: () => ({
    watchlist: JSON.parse(localStorage.getItem('watchlist')) || [],
  }),
  actions: {
    toggleWatch(movie) {
      const index = this.watchlist.findIndex((m) => m.id === movie.id);
      if (index === -1) this.watchlist.push(movie);
      else this.watchlist.splice(index, 1);
      this.saveToLocalStorage();
    },
    isWatchlist(movieId) {
      return this.watchlist.some((m) => m.id === movieId);
    },
    removeWatchlist(movieId) {
      this.watchlist = this.watchlist.filter((m) => m.id !== movieId);
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
    },
  },
});
