import { defineStore } from 'pinia';
import { auth, db } from '@/Firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const useUserDataStore = defineStore('userData', {
  state: () => ({
    favorites: [],
    watchlist: [],
    unsubFav: null,
    unsubWatch: null,
  }),
  actions: {
    init() {
      onAuthStateChanged(auth, (user) => {
        if (this.unsubFav) this.unsubFav();
        if (this.unsubWatch) this.unsubWatch();
        this.favorites = [];
        this.watchlist = [];

        if (user) {
          const uid = user.uid;

          const favCol = collection(db, 'users', uid, 'favorites');
          this.unsubFav = onSnapshot(
            favCol,
            (snap) => {
              this.favorites = snap.docs.map((d) => d.data());
            },
            (err) => {
              console.error('🔥 favorites listener error:', err);
            },
          );

          const watchCol = collection(db, 'users', uid, 'watchlist');
          this.unsubWatch = onSnapshot(
            watchCol,
            (snap) => {
              this.watchlist = snap.docs.map((d) => d.data());
            },
            (err) => {
              console.error('🔥 watchlist listener error:', err);
            },
          );
        }
      });
    },

    // Favorite
    async toggleFavorite(movie) {
      const user = auth.currentUser;
      if (!user) throw new Error('Not signed in');
      const favRef = doc(db, 'users', user.uid, 'favorites', String(movie.id));
      const exists = this.favorites.find((m) => m.id === movie.id);

      if (exists) await deleteDoc(favRef);
      else
        await setDoc(favRef, {
          id: movie.id,
          original_title: movie.original_title,
          poster_path: movie.poster_path,
        });
    },

    isFavorite(movieId) {
      return this.favorites.some((m) => m.id === movieId);
    },
    async removeFavorite(movieId) {
      const user = auth.currentUser;
      if (!user) throw new Error('Not signed in');
      const favRef = doc(db, 'users', user.uid, 'favorites', String(movieId));
      await deleteDoc(favRef);
    },

    // Watchlist
    async toggleWatchlist(movie) {
      const user = auth.currentUser;
      if (!user) throw new Error('Not signed in');
      const watchRef = doc(db, 'users', user.uid, 'watchlist', String(movie.id));
      const exists = this.watchlist.find((m) => m.id === movie.id);

      if (exists) {
        await deleteDoc(watchRef);
      } else {
        await setDoc(watchRef, {
          id: movie.id,
          original_title: movie.original_title,
          poster_path: movie.poster_path,
        });
      }
    },
    isWatchlist(movieId) {
      return this.watchlist.some((m) => m.id === movieId);
    },
    async removeWatchlist(movieId) {
      const user = auth.currentUser;
      if (!user) throw new Error('Not signed in');
      const watchRef = doc(db, 'users', user.uid, 'watchlist', String(movieId));
      await deleteDoc(watchRef);
    },
  },
});
