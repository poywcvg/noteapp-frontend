<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="brand">فارو</h1>
    </div>

    <nav class="sidebar-nav">
      <NuxtLink to="/" class="nav-item" active-class="active">
        <img :src="allNoteIcon" alt="" />
        <span class="nav-text">یادداشت‌ها</span>
      </NuxtLink>

      <NuxtLink to="/archive" class="nav-item" active-class="active">
        <img :src="archiveIcon" alt="" />
        <span class="nav-text">آرشیو ها</span>
      </NuxtLink>

      <NuxtLink to="/tags" class="nav-item" active-class="active">
        <img :src="tagsIcon" alt="" />
        <span class="nav-text">برچسب‌ ها</span>
      </NuxtLink>

      <NuxtLink to="/trash" class="nav-item" active-class="active">
        <img :src="trashIcon" alt="" />
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
const { user, logout } = useAuth();
import allNoteIcon from "~/assets/icons/AllNote.svg";
import archiveIcon from "~/assets/icons/archive.svg";
import tagsIcon from "~/assets/icons/tags.svg";
import trashIcon from "~/assets/icons/trash.svg";
const userInitial = computed(() => {
  if (!user.value) return "?";
  return user.value.first_name?.[0] || user.value.username?.[0] || "U";
});

const userName = computed(() => {
  if (!user.value) return "کاربر";

  if (user.value.first_name) {
    return user.value.last_name
      ? `${user.value.first_name} ${user.value.last_name}`
      : user.value.first_name;
  }

  return user.value.username;
});

const handleLogout = async () => {
  await logout();
  navigateTo("/login");
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 0 0 auto;
  width: 280px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1a1c23;
  color: #ffffff;
  padding: 28px 20px 24px;
  box-shadow: -10px 0 40px rgba(15, 23, 42, 0.08);
  z-index: 100;
}

.sidebar-header {
  padding: 0 8px 24px;
}

.brand {
  margin: 0;
  color: #ffffff;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.2;
  text-align: right;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
}

.nav-item,
.nav-logout {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 0 16px;
  border-radius: 12px;
  text-decoration: none;
  border: 1px solid transparent;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.nav-item {
  color: rgba(255, 255, 255, 0.72);
}

.nav-item:hover,
.nav-logout:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.08);
  transform: translateX(-2px);
}

.nav-item.active {
  background: rgba(245, 158, 11, 0.14);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.18);
  box-shadow: inset 3px 0 0 #f59e0b;
}

.nav-icon {
  width: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-text {
  font-size: 15px;
  font-weight: 500;
  line-height: 1;
  flex: 1;
}

.sidebar-footer {
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-logout {
  width: 100%;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  cursor: pointer;
  font: inherit;
  margin-bottom: 16px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.16);
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
  text-transform: uppercase;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.52);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  direction: ltr;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
