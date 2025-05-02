<script setup>
import { RouterView } from 'vue-router';

import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
authStore.fetchUser();
</script>

<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<style scope>
.container {
  /* max-width: 1px; */
  margin: 0 auto;
  width: 95%;
}
</style>
