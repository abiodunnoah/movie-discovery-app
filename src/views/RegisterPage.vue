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
  <div class="flex justify-center text-black pt-10">
    <div class="mx-auto p-15 bg-white rounded-lg shadow">
      <div class="pb-4">
        <h2 class="text-2xl font-bold">Register</h2>
      </div>
      <form @submit.prevent="submit">
        <div class="pb-4">
          <label class="block pb-1">Email:</label>
          <input v-model="email" type="email" class="w-full border rounded px-3 py-2" required />
        </div>
        <div class="pb-4">
          <label class="block pb-1">Password:</label>
          <input
            v-model="password"
            type="password"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div v-if="error" class="pb-4 text-red-500">{{ error }}</div>
        <button
          type="submit"
          class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
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
