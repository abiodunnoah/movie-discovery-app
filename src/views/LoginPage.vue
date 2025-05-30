<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref(null);

async function submit() {
  error.value = null;
  try {
    await auth.login(email.value, password.value);
    router.push('/');
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
    <div
      class="w-full max-w-md p-6 sm:p-8 md:p-10 rounded-lg shadow-md"
      :class="[
        'bg-[var(--color-background)]',
        'text-[var(--color-text)]',
        'border',
        'border-[var(--color-border)]',
      ]"
    >
      <div class="pb-4">
        <h2 class="text-2xl font-bold text-center text-[var(--color-heading)]">Login</h2>
      </div>
      <form @submit.prevent="submit">
        <div class="pb-4">
          <label class="block pb-1">Email:</label>
          <input
            v-model="email"
            type="email"
            class="w-full border border-[var(--color-border)] rounded px-3 py-2 bg-transparent text-[var(--color-text)]"
            required
          />
        </div>
        <div class="pb-4">
          <label class="block pb-1">Password:</label>
          <input
            v-model="password"
            type="password"
            class="w-full border border-[var(--color-border)] rounded px-3 py-2 bg-transparent text-[var(--color-text)]"
            required
          />
        </div>
        <div v-if="error" class="pb-4 text-red-500 text-sm">{{ error }}</div>
        <div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </form>
      <div class="pt-4">
        <p class="text-sm text-center">
          Don’t have an account?
          <RouterLink to="/register" class="text-blue-600 hover:underline">
            Register here
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
