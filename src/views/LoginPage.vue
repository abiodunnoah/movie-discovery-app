<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
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
        <h2 class="text-2xl font-bold text-center text-[var(--color-text)]">Login</h2>
      </div>

      <form @submit.prevent="submit">
        <div class="pb-4">
          <label class="block pb-1">Email:</label>
          <input v-model="email" type="email" class="w-full form-input" required />
        </div>

        <div class="pb-4">
          <label class="block pb-1">Password:</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full form-input pr-10"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
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

<style scope>
.form-input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--color-text, #181818);
  background-color: transparent;
  border: 1px solid var(--color-border, #cccccc);
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent, #3182ce);
  box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
  color: var(--color-text, #181818);
  background-color: var(--color-background-soft, #f5f5f5);
  transition:
    border-color 0.2s,
    background-color 0.2s;
}
</style>
