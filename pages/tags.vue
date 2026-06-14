<script setup>
import { API } from "~/constants/api";

const api = useApi();

const notes = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const newTag = ref("");

const getNotes = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    notes.value = await api(API.notes.list);
  } catch (error) {
    console.log(error);
    errorMessage.value = "خطا در دریافت برچسب‌ها";
  } finally {
    loading.value = false;
  }
};

const tags = computed(() => {
  const allTags = [];

  notes.value.forEach((note) => {
    if (note.tags) {
      note.tags.forEach((tag) => {
        allTags.push(tag.name);
      });
    }
  });

  return [...new Set(allTags)];
});

const createNoteWithTag = () => {
  if (!newTag.value.trim()) {
    return;
  }

  navigateTo({
    path: "/create-note",
    query: {
      tag: newTag.value,
    },
  });
};

onMounted(() => {
  getNotes();
});
</script>

<template>
  <section>
    <h1>برچسب‌ها</h1>

    <p class="description">
      برچسب‌ها از روی یادداشت‌هایی که ساختی نمایش داده می‌شوند.
    </p>

    <div class="create-box">
      <input v-model="newTag" placeholder="نام برچسب جدید" />

      <button @click="createNoteWithTag">ساخت یادداشت با این برچسب</button>
    </div>

    <p v-if="loading">در حال دریافت...</p>

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>

    <p v-if="!loading && tags.length === 0">هنوز برچسبی ساخته نشده است.</p>

    <div class="tags-list">
      <span v-for="tag in tags" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>
  </section>
</template>

<style scoped>
h1 {
  margin-bottom: 10px;
}

.description {
  color: #6b7280;
  margin-bottom: 20px;
}

.create-box {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-width: 260px;
}

button {
  border: none;
  background: #1f2937;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: white;
  color: #374151;
  padding: 10px 16px;
  border-radius: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.error {
  color: red;
}
</style>
