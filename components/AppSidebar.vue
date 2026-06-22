<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="brand">فارو</h1>
    </div>

    <nav class="sidebar-nav">
      <NuxtLink to="/" class="nav-item" active-class="active">
        <span class="nav-icon">📝</span>
        <span class="nav-text">یادداشت‌ها</span>
      </NuxtLink>

      <NuxtLink to="/archive" class="nav-item" active-class="active">
        <span class="nav-icon">📦</span>
        <span class="nav-text">بایگانی</span>
      </NuxtLink>

      <NuxtLink to="/tags" class="nav-item" active-class="active">
        <span class="nav-icon">🏷️</span>
        <span class="nav-text">برچسب‌ها</span>
      </NuxtLink>

      <NuxtLink to="/trash" class="nav-item" active-class="active">
        <span class="nav-icon">🗑️</span>
        <span class="nav-text">سطل زباله</span>
      </NuxtLink>
    </nav>

    <div class="sidebar-footer">
      <button @click="handleLogout" class="nav-logout">
        <span class="nav-icon">🚪</span>
        <span class="nav-text">خروج</span>
      </button>

      <div v-if="user" class="user-profile">
        <div class="user-avatar">
          {{ userInitial }}
        </div>
        <div class="user-info">
          <div class="user-name">{{ userName }}</div>
          <div class="user-email">{{ user.email }}</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
const { user, logout } = useAuth()

const userInitial = computed(() => {
  if (!user.value) return '?'
  return user.value.first_name?.[0] || user.value.username?.[0] || 'U'
})

const userName = computed(() => {
  if (!user.value) return 'کاربر'
  if (user.value.first_name) {
    return user.value.last_name 
      ? `${user.value.first_name} ${user.value.last_name}`
      : user.value.first_name
  }
  return user.value.username
})

const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: #111827;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.sidebar-header {
  padding: 0 24px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand {
  font-size: 28px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  text-align: center;
  letter-spacing: 1px;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.2s;
  border-right: 3px solid transparent;
  font-size: 15px;
  font-weight: 400;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
}

.nav-item.active {
  background: rgba(227, 147, 0, 0.15);
  color: #E39300;
  border-right-color: #E39300;
}

.nav-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
}

.sidebar-footer {
  padding: 0 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
}

.nav-logout {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  font-size: 15px;
  margin-bottom: 16px;
}

.nav-logout:hover {
  color: #E39300;
  background: rgba(227, 147, 0, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: rgba(227, 147, 0, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E39300;
  font-size: 18px;
  font-weight: 600;
  flex-shrink: 0;
  text-transform: uppercase;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}
</style>
