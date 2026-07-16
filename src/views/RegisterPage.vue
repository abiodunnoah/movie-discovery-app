<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const error = ref(null);
const fieldErrors = ref({ email: '', password: '', confirmPassword: '' });
const isSubmitting = ref(false);

const passwordStrength = computed(() => {
  const val = password.value;
  if (!val) return { label: '', score: 0, color: '' };
  let score = 0;
  if (val.length >= 8) score++;
  if (val.length >= 12) score++;
  if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
  if (/\d/.test(val)) score++;
  if (/[^a-zA-Z0-9]/.test(val)) score++;
  const map = {
    0: { label: 'Weak', score: 20, color: '#e74c3c' },
    1: { label: 'Weak', score: 20, color: '#e74c3c' },
    2: { label: 'Fair', score: 40, color: '#f39c12' },
    3: { label: 'Good', score: 60, color: '#3498db' },
    4: { label: 'Strong', score: 80, color: '#27ae60' },
    5: { label: 'Very strong', score: 100, color: '#27ae60' },
  };
  return map[score] || map[0];
});

function validate() {
  fieldErrors.value = { email: '', password: '', confirmPassword: '' };
  let valid = true;

  if (!email.value) {
    fieldErrors.value.email = 'Email is required';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    fieldErrors.value.email = "That doesn't look like an email";
    valid = false;
  }

  if (!password.value) {
    fieldErrors.value.password = 'Choose a password';
    valid = false;
  } else if (password.value.length < 6) {
    fieldErrors.value.password = 'At least 6 characters, make it a good one';
    valid = false;
  } else if (password.value.toLowerCase() === 'password') {
    fieldErrors.value.password = 'Come on, pick something else';
    valid = false;
  } else if (password.value.toLowerCase() === '123456') {
    fieldErrors.value.password = "That's the first thing a bot tries";
    valid = false;
  }

  if (!confirmPassword.value) {
    fieldErrors.value.confirmPassword = 'Confirm your password';
    valid = false;
  } else if (password.value !== confirmPassword.value) {
    fieldErrors.value.confirmPassword = "These don't match";
    valid = false;
  }

  return valid;
}

async function submit() {
  error.value = null;

  if (!validate()) return;

  isSubmitting.value = true;

  try {
    await auth.register(email.value, password.value);
    router.push('/');
  } catch (e) {
    const msg = e.message;
    if (msg.includes('email-already-in-use')) {
      error.value = 'An account with this email already exists';
    } else if (msg.includes('weak-password')) {
      error.value = 'That password is too weak. Try something longer.';
    } else if (msg.includes('invalid-email')) {
      error.value = "That email address isn't valid";
    } else {
      error.value = msg;
    }
  } finally {
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

        <h2 class="card-title">Create your account</h2>
        <p class="card-subtitle">Join to save favorites and build your watchlist.</p>

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
                autocomplete="new-password"
                placeholder="At least 6 characters"
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
            <div v-if="password.length > 0 && !fieldErrors.password" class="strength-bar">
              <div
                class="strength-fill"
                :style="{ width: passwordStrength.score + '%', background: passwordStrength.color }"
              ></div>
            </div>
            <p
              v-if="password.length > 0 && !fieldErrors.password"
              class="strength-label"
              :style="{ color: passwordStrength.color }"
            >
              {{ passwordStrength.label }}
            </p>
            <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>
          </div>

          <div class="field">
            <label for="confirmPassword" class="field-label">Confirm password</label>
            <div class="password-wrapper">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Type it again"
                class="field-input"
                :class="{ 'field-input--error': fieldErrors.confirmPassword }"
                @input="fieldErrors.confirmPassword = ''"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="password-toggle"
                :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
              >
                <i :class="showConfirmPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
              </button>
            </div>
            <p v-if="fieldErrors.confirmPassword" class="field-error">
              {{ fieldErrors.confirmPassword }}
            </p>
            <p v-else-if="confirmPassword && password === confirmPassword" class="field-match">
              <i class="fas fa-check"></i> Passwords match
            </p>
          </div>

          <div v-if="error" class="form-error">
            <i class="fas fa-circle-exclamation"></i>
            <span>{{ error }}</span>
          </div>

          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            <template v-if="isSubmitting">
              <span class="spinner"></span>
              Creating account...
            </template>
            <template v-else> Create account </template>
          </button>
        </form>

        <p class="switch-page">
          Already have an account?
          <router-link to="/login" class="switch-link">Sign in</router-link>
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

.field-match {
  font-size: 12px;
  color: #27ae60;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
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

.strength-bar {
  height: 4px;
  background: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 2px;
}

.strength-fill {
  height: 100%;
  border-radius: 4px;
  transition:
    width 0.2s,
    background 0.2s;
}

.strength-label {
  font-size: 11px;
  margin: 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
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
