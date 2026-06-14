<script setup>
import { API } from "~/constants/api";

const route = useRoute();
const api = useApi();

const noteId = computed(() => route.query.id);

const title = ref("");
const content = ref("");
const tagsInput = ref("");
const isImportant = ref(false);

const loading = ref(false);
const errorMessage = ref("");
const notes = ref([]);
const selectedTag = ref("");

const getOldTags = async () => {
  try {
    notes.value = await api(API.notes.list);
  } catch (error) {
    console.log(error);
  }
};

const oldTags = computed(() => {
  const tags = [];

  notes.value.forEach((note) => {
    if (note.tags) {
      note.tags.forEach((tag) => {
        tags.push(tag.name);
      });
    }
  });

  return [...new Set(tags)];
});

const addSelectedTag = () => {
  if (!selectedTag.value) return;

  const currentTags = tagsInput.value
    ? tagsInput.value.split(",").map((tag) => tag.trim())
    : [];

  if (!currentTags.includes(selectedTag.value)) {
    currentTags.push(selectedTag.value);
  }

  tagsInput.value = currentTags.join(",");
  selectedTag.value = "";
};

onMounted(() => {
  getOldTags();
});
const getNote = async () => {
  if (!noteId.value) {
    errorMessage.value = "شناسه یادداشت پیدا نشد";
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = "";

    const note = await api(API.notes.detail(noteId.value));

    title.value = note.title;
    content.value = note.content;
    isImportant.value = note.is_important;

    if (note.tags) {
      tagsInput.value = note.tags.map((tag) => tag.name).join(",");
    }
  } catch (error) {
    console.log(error);
    errorMessage.value = "خطا در دریافت یادداشت";
  } finally {
    loading.value = false;
  }
};

const updateNote = async () => {
  if (!noteId.value) {
    errorMessage.value = "شناسه یادداشت پیدا نشد";
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = "";

    await api(API.notes.update(noteId.value), {
      method: "PUT",
      body: {
        title: title.value,
        content: content.value,
        is_important: isImportant.value,
        tags_input: tagsInput.value,
      },
    });

    navigateTo("/notes");
  } catch (error) {
    console.log(error);
    errorMessage.value = "خطا در ویرایش یادداشت";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getNote();
});
</script>

<template>
  <div class="form-box">
    <h1>ویرایش یادداشت</h1>

    <p v-if="loading">در حال دریافت...</p>

    <input v-model="title" placeholder="عنوان یادداشت" />

    <textarea v-model="content" placeholder="متن یادداشت" />

    <input v-model="tagsInput" placeholder="برچسب‌ها مثلا: vue,nuxt,work" />

    <label class="checkbox">
      <input v-model="isImportant" type="checkbox" />
      مهم است
    </label>

    <button @click="updateNote">ذخیره تغییرات</button>

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.form-box {
  max-width: 650px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: white;
  padding: 24px;
  border-radius: 14px;
}

input,
textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

textarea {
  min-height: 180px;
  resize: vertical;
}

.checkbox {
  display: flex;
  gap: 8px;
  align-items: center;
}

button {
  padding: 12px;
  border: none;
  background: #1f2937;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.error {
  color: red;
}
</style>
