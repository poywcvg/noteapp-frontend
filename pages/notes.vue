<script setup>
import { API } from "~/constants/api";

const api = useApi();

const notes = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const searchQuery = ref("");

let debounceTimer = null;

const getNotes = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    const url = searchQuery.value
      ? `${API.notes.list}?search=${encodeURIComponent(searchQuery.value)}`
      : API.notes.list;

    notes.value = await api(url);
  } catch (error) {
    console.log(error);
    errorMessage.value = "خطا در دریافت یادداشت‌ها";
  } finally {
    loading.value = false;
  }
};

const archiveNote = async (id) => {
  try {
    await api(API.notes.archive(id), {
      method: "POST",
    });

    await getNotes();
  } catch (error) {
    console.log(error);
    errorMessage.value = "خطا در آرشیو کردن یادداشت";
  }
};

const deleteNote = async (id) => {
  try {
    await api(API.notes.delete(id), {
      method: "DELETE",
    });

    await getNotes();
  } catch (error) {
    console.log(error);
    errorMessage.value = "خطا در حذف یادداشت";
  }
};

watch(searchQuery, () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    getNotes();
  }, 400);
});

onMounted(() => {
  getNotes();
});
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">یادداشت‌ها</h1>
        <p class="page-subtitle">لیست یادداشت‌های شما</p>
      </div>

      <NuxtLink to="/create-note" class="btn-primary">
        + ساخت یادداشت جدید
      </NuxtLink>
    </div>

    <div class="search-box">
      <input
        v-model="searchQuery"
        class="search-input"
        type="text"
        placeholder="جستجو در عنوان، متن یا برچسب..."
      />

      <button
        v-if="searchQuery"
        class="btn-secondary"
        @click="searchQuery = ''"
      >
        پاک کردن
      </button>
    </div>

    <p v-if="loading" class="empty-text">در حال دریافت...</p>

    <p v-if="errorMessage" class="error-text">
      {{ errorMessage }}
    </p>

    <p v-if="!loading && notes.length === 0" class="empty-text">
      یادداشتی پیدا نشد.
    </p>

    <div class="notes-grid">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @archive="archiveNote"
        @delete="deleteNote"
      />
    </div>
  </section>
</template>
