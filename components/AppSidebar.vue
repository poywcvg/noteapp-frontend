<template>
  <aside class="sidebar">
    <div class="brand" v-on:click="navigateTo('/notes')">
      <h2>فارو</h2>
      <p>آواپرداز همراه دیجیتال</p>
    </div>

    <nav class="menu">
      <NuxtLink to="/notes">همه یادداشت‌ها</NuxtLink>
      <NuxtLink to="/archive">آرشیو یادداشت‌ها</NuxtLink>
      <NuxtLink to="/tags">برچسب</NuxtLink>
      <NuxtLink to="/trash">سطل زباله</NuxtLink>

      <NuxtLink v-if="!isLoggedIn" to="/login">ورود</NuxtLink>
      <NuxtLink v-if="!isLoggedIn" to="/register">ثبت نام</NuxtLink>

      <button v-if="isLoggedIn" @click="logout" class="logout-btn">
        خروج
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();

const isLoggedIn = computed(function () {
  return process.client && !!localStorage.getItem("access_token");
});

function navigateTo(path) {
  router.push(path);
}

function logout() {
  if (process.client) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
  router.push("/login");
}
</script>

<style scoped>
.logout-btn {
  background: #dc2626;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}
.sidebar {
  position: fixed;
  top: 0;
  right: 0;

  width: 260px;
  height: 100vh;

  background: #0f172a;
  color: white;

  padding: 24px;

  display: flex;
  flex-direction: column;
}

.brand {
  margin-bottom: 40px;
}

.brand h2 {
  color: #f59e0b;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu a {
  color: white;
  text-decoration: none;
  padding: 12px;
  border-radius: 10px;
}

.menu a.router-link-active {
  background: #1e293b;
}
</style>
