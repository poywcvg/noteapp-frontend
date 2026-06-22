<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>ورود به حساب کاربری</h2>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div v-if="error" class="error-box">
          <div class="error-text">{{ error }}</div>
        </div>

        <div class="input-group">
          <div>
            <label for="username" class="sr-only">نام کاربری</label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              required
              class="input-field input-top"
              placeholder="نام کاربری"
            />
          </div>

          <div>
            <label for="password" class="sr-only">رمز عبور</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="input-field input-bottom"
              placeholder="رمز عبور"
            />
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isLoading" class="submit-btn">
            <span v-if="isLoading">در حال ورود...</span>
            <span v-else>ورود</span>
          </button>
        </div>

        <div class="register-link-container">
          <NuxtLink to="/register" class="register-link">
            حساب کاربری ندارید؟ ثبت‌نام کنید
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

const { login, isLoading, error, initAuth } = useAuth();
const username = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    await login({
      username: username.value,
      password: password.value,
    });

    await navigateTo("/");
  } catch (err) {
    console.error("Login failed:", err);
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 3rem 1rem;
}

.login-box {
  max-width: 28rem;
  width: 100%;
}

.login-header {
  margin-top: 1.5rem;
}

.login-header h2 {
  text-align: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
}

.login-form {
  margin-top: 2rem;
}

.error-box {
  background-color: #fee;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.error-text {
  font-size: 0.875rem;
  color: #991b1b;
}

.input-group {
  border-radius: 6px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.input-field {
  appearance: none;
  position: relative;
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  color: #111827;
  font-size: 0.875rem;
  box-sizing: border-box;
}

.input-field::placeholder {
  color: #6b7280;
}

.input-field:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  z-index: 10;
}

.input-top {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom: none;
}

.input-bottom {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.submit-btn {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  color: white;
  background-color: #4f46e5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #4338ca;
}

.submit-btn:focus {
  outline: none;
  box-shadow:
    0 0 0 2px white,
    0 0 0 4px #6366f1;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.register-link-container {
  text-align: center;
  margin-top: 1rem;
}

.register-link {
  font-weight: 500;
  color: #4f46e5;
  transition: color 0.2s;
  text-decoration: none;
}

.register-link:hover {
  color: #6366f1;
}
</style>
