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
  <div class="register-root">
    <div class="form-container">
      <h2 class="form-title">Register</h2>
      <form @submit.prevent="submit" class="form-content">
        <div class="form-group">
          <label for="email" class="form-label">Email:</label>
          <input id="email" v-model="email" type="email" required class="form-input" />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Password:</label>
          <input id="password" v-model="password" type="password" required class="form-input" />
        </div>
        <div v-if="error" class="form-error">{{ error }}</div>
        <!-- Sign Up button with fallback -->
        <button type="submit" class="submit-button">Sign Up</button>
      </form>
      <p class="switch-login">
        Already have an account?
        <!-- “Login here” link with fallback -->
        <router-link to="/login" class="login-link">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Root wrapper */
.register-root {
  background-color: var(--color-background, #ffffff);
  color: var(--color-text, #181818);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}

/* Form container */
.form-container {
  background-color: var(--color-background-soft, #f5f5f5);
  border: 1px solid var(--color-border, #cccccc);
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  padding: 24px;
  box-sizing: border-box;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Form title */
.form-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--color-text, #181818);
}

/* Form layout */
.form-content {
  display: flex;
  flex-direction: column;
}

/* Label + Input */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: var(--color-text, #181818);
}

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
  border-color: var(--color-accent, #38a169);
}

.form-error {
  margin-bottom: 16px;
  font-size: 13px;
  color: #e53e3e;
}

/* Sign Up button with fallback color if --color-accent is missing */
.submit-button {
  background-color: var(--color-accent, #38a169);
  color: #ffffff;
  padding: 10px 16px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: var(--color-accent-hover, #2f855a);
}

/* “Already have an account?” text */
.switch-login {
  margin-top: 16px;
  font-size: 14px;
  text-align: center;
  color: var(--color-text, #181818);
}

/* Login link with fallback if --color-link is missing */
.login-link {
  color: var(--color-link, #3182ce);
  text-decoration: none;
  margin-left: 4px;
}

.login-link:hover {
  color: var(--color-link-hover, #2b6cb0);
  text-decoration: underline;
}

/* Responsive tweaks */
@media (max-width: 400px) {
  .form-container {
    padding: 16px;
  }
  .form-title {
    font-size: 20px;
  }
  .submit-button {
    font-size: 14px;
    padding: 8px 14px;
  }
}

@media (min-width: 768px) {
  .form-container {
    padding: 32px;
  }
  .form-title {
    font-size: 26px;
  }
  .submit-button {
    font-size: 17px;
    padding: 12px 20px;
  }
}
</style>
