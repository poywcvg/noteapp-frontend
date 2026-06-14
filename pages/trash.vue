<script setup>
import { API } from "~/constants/api";

const api = useApi();

const notes = ref([]);
const loading = ref(false);
const errorMessage = ref("");

const getDeletedNotes = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    notes.value = await api(API.notes.deleted);
  } catch (error) {
    console.log(error);
    notes.value = [];
    errorMessage.value = "خطا در دریافت یادداشت‌ های حذف‌ شده";
  } finally {
    loading.value = false;
  }
};

const restoreNote = async (note) => {
  errorMessage.value = "";

  try {
    await api(API.notes.restore(note.id), {
      method: "POST",
      body: {
        title: note.title,
        content: note.content || "",
        is_important: note.is_important || false,
        is_archived: false,
        tags_input: note.tags ? note.tags.map((tag) => tag.name).join(",") : "",
      },
    });

    await getDeletedNotes();
  } catch (error) {
    console.log(error);
    errorMessage.value = "خطا در بازگردانی یادداشت";
  }
};

const hardDeleteNote = async (id) => {
  const confirmed = confirm(
    "آیا مطمئنی می‌خواهی این یادداشت برای همیشه حذف شود؟",
  );

  if (!confirmed) {
    return;
  }

  try {
    await api(API.notes.hardDelete(id), {
      method: "DELETE",
    });

    await getDeletedNotes();
  } catch (error) {
    console.log(error);
    errorMessage.value = "خطا در حذف دائمی یادداشت";
  }
};

onMounted(() => {
  getDeletedNotes();
});
</script>

<template>
  <section>
    <h1>سطل زباله</h1>

    <p v-if="loading">در حال دریافت...</p>

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>

    <p v-if="!loading && notes.length === 0">یادداشت حذف‌ شده‌ای وجود ندارد.</p>

    <div class="notes-grid">
      <article v-for="note in notes" :key="note.id" class="note-card">
        <h3>{{ note.title }}</h3>

        <div class="tags">
          <span v-for="tag in note.tags" :key="tag.id" class="tag">
            {{ tag.name }}
          </span>
        </div>

        <div class="actions">
          <button class="restore-btn" @click="restoreNote(note)">
            بازگردانی
          </button>

          <button class="delete-btn" @click="hardDeleteNote(note.id)">
            حذف دائمی
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
h1 {
  margin-bottom: 24px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 18px;
}

.note-card {
  background: white;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.tag {
  background: #e5e7eb;
  color: #374151;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

button {
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.restore-btn {
  background: #16a34a;
  color: white;
}

.delete-btn {
  background: #dc2626;
  color: white;
}

.error {
  color: red;
}
</style>
