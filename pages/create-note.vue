<script setup>
import { API } from "~/constants/api";

const api = useApi();

const title = ref("");
const content = ref("");
const route = useRoute();
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
onMounted(() => {
  if (route.query.tag) {
    tagsInput.value = route.query.tag;
  }
});
const tagsInput = ref("");
const isImportant = ref(false);

const loading = ref(false);
const errorMessage = ref("");

const createNote = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    await api(API.notes.create, {
      method: "POST",
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
    errorMessage.value = "خطا در ساخت یادداشت";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="form-box">
    <h1>ساخت یادداشت</h1>

    <input v-model="title" placeholder="عنوان یادداشت" />

    <textarea v-model="content" placeholder="متن یادداشت"></textarea>

    <input
      v-model="tagsInput"
      placeholder="برچسب‌ ها را با کاما «,» جدا کنید"
    />

    <label class="checkbox">
      <input v-model="isImportant" type="checkbox" />
      مهم است
    </label>
    <div class="tag-select-box">
      <select v-model="selectedTag">
        <option value="">انتخاب از برچسب‌ های قبلی</option>

        <option v-for="tag in oldTags" :key="tag" :value="tag">
          {{ tag }}
        </option>
      </select>

      <button type="button" @click="addSelectedTag">افزودن برچسب</button>
    </div>
    <button @click="createNote" :disabled="loading">
      {{ loading ? "در حال ذخیره..." : "ذخیره یادداشت" }}
    </button>

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
.tag-select-box {
  display: flex;
  gap: 10px;
}

select {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.tag-select-box button {
  background: #374151;
}
</style>
