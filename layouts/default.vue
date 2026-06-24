<template>
  <div class="app-layout">
    <AppSidebar />

    <main class="main-content">
      <div class="content-shell">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";

const auth = useAuth();

onMounted(() => {
  auth.initAuth();
});
</script>

<style>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: inherit;
}

html,
body,
#__nuxt {
  min-height: 100%;
  font-family: "BYekan", Tahoma, Arial, sans-serif;
}

body {
  background: #f8fafc;
  color: #111827;
  direction: rtl;
  text-align: right;
}

button,
input,
textarea,
select {
  font-family: inherit;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  direction: rtl;
  font-family: inherit;
}

.main-content {
  flex: 1;
  min-height: 100vh;
  padding: 24px;
  margin-right: 280px;
}

.content-shell {
  max-width: 1008px;
  min-height: calc(100vh - 48px);
  margin: 0 auto;
  padding: 16px 8px;
  font-family: inherit;
}
</style>
