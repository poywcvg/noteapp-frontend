<!-- NoteEditor.vue -->
<template>
  <form class="note-editor" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="title">عنوان</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        placeholder="عنوان یادداشت"
      />
    </div>

    <div class="form-group">
      <label for="content">متن یادداشت</label>
      <textarea
        id="content"
        v-model="form.content"
        rows="8"
        placeholder="متن یادداشت را وارد کنید..."
      />
    </div>

    <div class="form-group">
      <label for="tags">تگ‌ ها</label>
      <input
        id="tags"
        v-model="tagsInput"
        type="text"
        placeholder="مثلاً : کار, مهم, شخصی"
      />
    </div>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>
 
    <div class="actions">
      <button type="button" class="cancel-btn" @click="$emit('cancel')">
        انصراف
      </button>

      <button type="submit" class="save-btn" :disabled="isLoading">
        {{ isLoading ? 'در حال ذخیره...' : submitText }}
      </button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      title: '',
      content: '',
      tags: [],
    }),
  },
  submitText: {
    type: String,
    default: 'ذخیره',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  title: '',
  content: '',
})

const tagsInput = ref('')

const syncForm = () => {
  form.title = props.initialData?.title || ''
  form.content = props.initialData?.content || ''

  if (Array.isArray(props.initialData?.tags)) {
    tagsInput.value = props.initialData.tags
      .map((tag) => {
        if (typeof tag === 'object') return tag.name
        return tag
      })
      .filter(Boolean)
      .join(', ')
  } else {
    tagsInput.value = ''
  }
}

watch(
  () => props.initialData,
  () => {
    syncForm()
  },
  {
    immediate: true,
    deep: true,
  }
)

const handleSubmit = () => {
  const payload = {
    title: form.title,
    content: form.content,
    tags: tagsInput.value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  }

  emit('submit', payload)
}
</script>

<style scoped>
.note-editor {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 800;
  color: #4b3f35;
}

input,
textarea {
  width: 100%;
  border: 1px solid #e3d6c6;
  border-radius: 16px;
  padding: 13px 15px;
  font-size: 15px;
  background: #fff;
  color: #2d241d;
  outline: none;
}

textarea {
  resize: vertical;
  line-height: 1.8;
}

input:focus,
textarea:focus {
  border-color: #d5a06a;
}

.error-message {
  margin: 0;
  color: #b42318;
  font-size: 14px;
  font-weight: 700;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

button {
  border: none;
  border-radius: 14px;
  padding: 11px 18px;
  font-weight: 900;
  cursor: pointer;
}

.cancel-btn {
  background: #f3e7d7;
  color: #6a5643;
}

.save-btn {
  background: #d5a06a;
  color: #fff;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
