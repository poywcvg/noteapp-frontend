<script setup>
import { API } from "~/constants/api";
definePageMeta({
  layout: "auth",
});
const api = useApi();

const username = ref("");
const email = ref("");
const firstName = ref("");
const lastName = ref("");
const phoneNumber = ref("");
const password = ref("");
const password2 = ref("");

const errorMessage = ref("");
const loading = ref(false);

const register = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    const response = await api(API.auth.register, {
      method: "POST",
      body: {
        username: username.value,
        email: email.value,
        first_name: firstName.value,
        last_name: lastName.value,
        phone_number: phoneNumber.value,
        password: password.value,
        password2: password2.value,
      },
    });

    localStorage.setItem("access_token", response.access);
    localStorage.setItem("refresh_token", response.refresh);

    navigateTo("/notes");
  } catch (error) {
    console.log(error);
    errorMessage.value = "ثبت نام ناموفق بود";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="form-box">
    <h1>ثبت نام</h1>

    <input v-model="username" placeholder="نام کاربری" />
    <input v-model="email" placeholder="ایمیل" />
    <input v-model="firstName" placeholder="نام" />
    <input v-model="lastName" placeholder="نام خانوادگی" />
    <input v-model="phoneNumber" placeholder="شماره موبایل" />

    <input v-model="password" type="password" placeholder="رمز عبور" />

    <input v-model="password2" type="password" placeholder="تکرار رمز عبور" />

    <button @click="register">
      {{ loading ? "در حال ثبت نام..." : "ثبت نام" }}
    </button>

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>
    <p>
      حساب کاربری داری؟
      <NuxtLink to="/login" class="text-blue-500 underline">
        وارد شوید
      </NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.form-box {
  max-width: 420px;
  margin: 40px auto;
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
