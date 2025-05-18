<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref(null);

async function submit() {
  error.value = null;
  try {
    await auth.register(email.value, password.value);
    router.push('/');
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<template>
  <div class="flex justify-center pt-10">
    <div
      class="mx-auto p-10 rounded-lg shadow-md max-w-md w-full border"
      :class="[
        'bg-[var(--color-background)]',
        'text-[var(--color-text)]',
        'border-[var(--color-border)]',
      ]"
    >
      <div class="pb-4">
        <h2 class="text-2xl font-bold text-[var(--color-heading)]">Register</h2>
      </div>
      <form @submit.prevent="submit">
        <div class="pb-4">
          <label class="block pb-1">Email:</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full border border-[var(--color-border)] rounded px-3 py-2 bg-transparent text-[var(--color-text)]"
          />
        </div>
        <div class="pb-4">
          <label class="block pb-1">Password:</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full border border-[var(--color-border)] rounded px-3 py-2 bg-transparent text-[var(--color-text)]"
          />
        </div>
        <div v-if="error" class="pb-4 text-red-500">{{ error }}</div>
        <button
          type="submit"
          class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
        >
          Sign Up
        </button>
      </form>
      <p class="pt-4 text-sm text-center">
        Already have an account?
        <router-link to="/login" class="text-green-600 hover:underline"> Login here </router-link>
      </p>
    </div>
  </div>
</template>
