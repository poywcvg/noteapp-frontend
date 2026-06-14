<template>
  <div class="layout">
    <AppSidebar />

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.content {
  margin-right: 260px;
  min-height: 100vh;
  padding: 32px;
  background: #f8fafc;
}
</style>
