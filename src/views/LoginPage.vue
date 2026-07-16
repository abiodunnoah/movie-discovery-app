<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const remember = ref(false);
const error = ref(null);
const fieldErrors = ref({ email: '', password: '' });
const isSubmitting = ref(false);

function validate() {
  fieldErrors.value = { email: '', password: '' };
  let valid = true;

  if (!email.value) {
    fieldErrors.value.email = 'Email is required';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    fieldErrors.value.email = "Looks like this isn't an email";
    valid = false;
  }

  if (!password.value) {
    fieldErrors.value.password = 'Password is required';
    valid = false;
  }

  return valid;
}

async function submit() {
  error.value = null;

  if (!validate()) return;

  isSubmitting.value = true;

  try {
    await auth.login(email.value, password.value);
    router.push('/');
  } catch (e) {
    const msg = e.message;
    if (
      msg.includes('user-not-found') ||
      msg.includes('wrong-password') ||
      msg.includes('invalid-credential')
    ) {
      error.value = 'Email or password is incorrect';
    } else if (msg.includes('too-many-requests')) {
      error.value = 'Too many attempts. Try again later.';
    } else if (msg.includes('invalid-email')) {
      error.value = "That email address isn't valid";
    } else {
      error.value = msg;
    }
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="card-accent"></div>

      <div class="card-body">
        <div class="brand">
          <span class="brand-icon">&#127916;</span>
          <span class="brand-text">Movie Discovery</span>
        </div>

        <h2 class="card-title">Welcome back</h2>
        <p class="card-subtitle">Sign in to pick up where you left off.</p>

        <form @submit.prevent="submit" class="auth-form" novalidate>
          <div class="field">
            <label for="email" class="field-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="field-input"
              :class="{ 'field-input--error': fieldErrors.email }"
              @input="fieldErrors.email = ''"
            />
            <p v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</p>
          </div>

          <div class="field">
            <label for="password" class="field-label">Password</label>
            <div class="password-wrapper">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Your password"
                class="field-input"
                :class="{ 'field-input--error': fieldErrors.password }"
                @input="fieldErrors.password = ''"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
              </button>
            </div>
            <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>
          </div>

          <div class="field-row">
            <label class="checkbox">
              <input v-model="remember" type="checkbox" class="checkbox-input" />
              <span class="checkbox-mark"></span>
              <span class="checkbox-label">Remember me</span>
            </label>
          </div>

          <div v-if="error" class="form-error">
            <i class="fas fa-circle-exclamation"></i>
            <span>{{ error }}</span>
          </div>

          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            <template v-if="isSubmitting">
              <span class="spinner"></span>
              Signing in...
            </template>
            <template v-else> Sign in </template>
          </button>
        </form>

        <p class="switch-page">
          Don't have an account?
          <RouterLink to="/register" class="switch-link">Create one</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: var(--color-background);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
}

.card-accent {
  height: 4px;
  background: linear-gradient(90deg, #e50914, #f5c518, #e50914);
  background-size: 200% 100%;
  animation: shimmer 4s ease-in-out infinite;
}

@keyframes shimmer {
  0%,
  100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 0%;
  }
}

.card-body {
  padding: 32px 28px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.brand-icon {
  font-size: 22px;
  line-height: 1;
}

.brand-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
  margin-bottom: 6px;
}

.card-subtitle {
  font-size: 14px;
  color: var(--color-text);
  opacity: 0.6;
  margin-bottom: 28px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.8;
}

.field-input {
  width: 100%;
  padding: 11px 14px;
  font-size: 14px;
  color: var(--color-text);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  outline: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.field-input::placeholder {
  color: var(--color-text);
  opacity: 0.35;
}

.field-input:focus {
  border-color: #e50914;
  box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.12);
}

.field-input--error {
  border-color: #e74c3c;
}

.field-input--error:focus {
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.12);
}

.field-error {
  font-size: 12px;
  color: #e74c3c;
  margin: 0;
}

.password-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text);
  opacity: 0.45;
  cursor: pointer;
  padding: 4px;
  font-size: 15px;
  display: flex;
  align-items: center;
  transition: opacity 0.15s;
}

.password-toggle:hover {
  opacity: 0.8;
}

.field-row {
  display: flex;
  align-items: center;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkbox-mark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  flex-shrink: 0;
  position: relative;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.checkbox-input:checked + .checkbox-mark {
  background: #e50914;
  border-color: #e50914;
}

.checkbox-input:checked + .checkbox-mark::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-input:focus-visible + .checkbox-mark {
  outline: 2px solid rgba(229, 9, 20, 0.4);
  outline-offset: 2px;
}

.checkbox-label {
  font-size: 13px;
  color: var(--color-text);
  opacity: 0.7;
}

.form-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.25);
  border-radius: 8px;
  font-size: 13px;
  color: #e74c3c;
}

.form-error i {
  font-size: 14px;
  flex-shrink: 0;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #e50914;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    background 0.15s,
    transform 0.1s;
}

.submit-btn:hover:not(:disabled) {
  background: #b20710;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.switch-page {
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text);
  opacity: 0.6;
}

.switch-link {
  color: #e50914;
  font-weight: 600;
  text-decoration: none;
}

.switch-link:hover {
  text-decoration: underline;
}
</style>
