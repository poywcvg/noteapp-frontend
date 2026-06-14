<script setup>
import { API } from "~/constants/api";
definePageMeta({
  layout: "auth",
});
const api = useApi();

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);

const login = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    const response = await api(API.auth.login, {
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
      },
    });

    localStorage.setItem("access_token", response.access);
    localStorage.setItem("refresh_token", response.refresh);

    navigateTo("/notes");
  } catch (error) {
    console.log(error);
    errorMessage.value = "ورود ناموفق بود";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="form-box">
    <h1>ورود</h1>

    <input v-model="username" placeholder="نام کاربری" />

    <input v-model="password" type="password" placeholder="رمز عبور" />

    <button @click="login">
      {{ loading ? "در حال ورود..." : "ورود" }}
    </button>

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>
    <p>
      حساب کاربری نداری؟
      <NuxtLink to="/register" class="text-blue-500 underline">
        ثبت‌ نام کنید
      </NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.form-box {
  max-width: 380px;
  margin: 80px auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: white;
  padding: 24px;
  border-radius: 14px;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  padding: 12px;
  border: none;
  background: #1f2937;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.error {
  color: red;
}
</style>
