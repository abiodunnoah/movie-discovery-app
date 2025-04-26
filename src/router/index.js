import { createRouter, createWebHistory } from 'vue-router';
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.user) {
    next('/login');
  } else {
    next();
  }
});

export default router;
