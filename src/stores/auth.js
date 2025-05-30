import { defineStore } from 'pinia';
import { auth } from '@/Firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async login(email, password) {
      await signInWithEmailAndPassword(auth, email, password);
    },
    async register(email, password) {
      await createUserWithEmailAndPassword(auth, email, password);
    },
    async logout() {
      await signOut(auth);
      this.user = null;
    },
    fetchUser() {
      onAuthStateChanged(auth, (user) => {
        this.user = user;
      });
    },
  },
});
