import { createRouter, createWebHistory } from 'vue-router';
import MovieView from '@/views/MovieView.vue';

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
    },
  ],
});

export default router;
