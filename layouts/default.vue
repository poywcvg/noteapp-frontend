<template>
  <div class="app-layout">
    <AppSidebar />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const auth = useAuth()

onMounted(() => {
  auth.initAuth()
})
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #F7F5F2;
  direction: rtl;
}

.main-content {
  flex: 1;
  margin-right: 280px;
  min-height: 100vh;
}
</style>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Vazir', sans-serif;
  background: #F7F5F2;
  color: #1F2421;
  direction: rtl;
}

/* Import fonts if needed */
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap');
</style>
