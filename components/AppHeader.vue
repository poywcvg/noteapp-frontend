<template>
  <aside class="sidebar">
    <div class="brand">NoteApp</div>

    <nav class="nav">
      <NuxtLink to="/" class="nav-link">همه یادداشت‌ها</NuxtLink>
      <NuxtLink to="/notes/create" class="nav-link">یادداشت جدید</NuxtLink>
      <NuxtLink to="/archive" class="nav-link">آرشیو</NuxtLink>
      <NuxtLink to="/trash" class="nav-link">زباله‌دان</NuxtLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  background: #fffaf5;
  border-inline-end: 1px solid #eadfce;
  padding: 24px 18px;
}
.brand {
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 28px;
  color: #2d241d;
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.nav-link {
  text-decoration: none;
  color: #5d5147;
  padding: 12px 14px;
  border-radius: 14px;
  font-weight: 700;
}
.nav-link.router-link-exact-active {
  background: #f3e7d7;
  color: #2d241d;
}
</style>
