import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import MovieView from '@/views/MovieView.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'movies',
      component: MovieView,
    },
    {
      path: '/movie/:id',
      name: 'MoviesDetails',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/MoviesDetails.vue'),
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: () => import('@/views/MovieFavorites.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/watchlist',
      name: 'Watchlist',
      component: () => import('@/views/MovieWatchList.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: '/Login',
      component: () => import('@/views/LoginPage.vue'),
    },
    {
      path: '/register',
      name: '/Register',
      component: () => import('@/views/RegisterPage.vue'),
    },
  ],
});

// A helper that returns a promise which resolves once Firebase knows the user state
function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener();
        resolve(user);
      },
      (error) => {
        removeListener();
        reject(error);
      },
    );
  });
}

// Navigation guard to check authentication status
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  let firebaseUser = null;
  try {
    firebaseUser = await getCurrentUser();
  } catch (error) {
    console.error('Error getting current user:', error);
    firebaseUser = null;
  }

  if (firebaseUser && !authStore.user) {
    authStore.fetchUser?.();
  }

  // Now enforce the route's meta.requiresAuth
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login');
  } else {
    next();
  }
  const user = await getCurrentUser();
  if (user) {
    next();
  } else {
    next({ name: 'Login' });
  }
});

export default router;
