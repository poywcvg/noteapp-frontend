<!-- NoteModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleClose">
        <div class="modal-container" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <div class="header-title">
              <span class="header-icon">{{ isEditMode ? "✎" : "+" }}</span>
              <h2>{{ isEditMode ? "ویرایش یادداشت" : "یادداشت جدید" }}</h2>
            </div>
            <button @click="handleClose" class="close-btn" aria-label="بستن">
              ✕
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="modal-body">
            <!-- Title -->
            <div class="form-group">
              <label for="title">عنوان</label>
              <input
                id="title"
                ref="titleInput"
                v-model="formData.title"
                type="text"
                placeholder="عنوان یادداشت..."
                maxlength="200"
                required
              />
              <span class="char-count">{{ formData.title.length }}/200</span>
            </div>

            <!-- Content -->
            <div class="form-group">
              <label for="content">متن</label>
              <textarea
                id="content"
                v-model="formData.content"
                placeholder="متن یادداشت..."
                rows="8"
                required
              ></textarea>
            </div>

            <!-- Tags -->
            <div class="form-group">
              <label for="tags">تگ‌ها</label>
              <div class="tags-input-container" @click="focusTagInput">
                <span
                  v-for="(tag, index) in selectedTags"
                  :key="index"
                  class="tag-chip"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click.stop="removeTag(index)"
                    class="remove-tag-btn"
                    aria-label="حذف تگ"
                  >
                    ×
                  </button>
                </span>
                <input
                  id="tags"
                  ref="tagInputEl"
                  v-model="tagInput"
                  type="text"
                  :placeholder="selectedTags.length ? '' : 'تگ اضافه کنید...'"
                  @keydown.enter.prevent="addTag"
                  @keydown.comma.prevent="addTag"
                  @keydown.delete="handleTagBackspace"
                />
              </div>
              <p class="help-text">Enter یا ویرگول برای افزودن تگ</p>
            </div>

            <!-- Important -->
            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="formData.is_important" type="checkbox" />
                <span class="checkbox-text">
                  <span class="star-icon">⭐</span>
                  یادداشت مهم
                </span>
              </label>
            </div>

            <!-- Existing attachments (edit mode) -->
            <div v-if="isEditMode && attachments.length" class="form-group">
              <label>فایل‌های پیوست</label>
              <div class="attachments-list">
                <div
                  v-for="attachment in attachments"
                  :key="attachment.id"
                  class="attachment-item"
                >
                  <span class="attachment-name">
                    📎 {{ getFileName(attachment.file) }}
                  </span>
                  <button
                    type="button"
                    @click="removeAttachment(attachment.id)"
                    class="remove-attachment-btn"
                    :disabled="deletingAttachment === attachment.id"
                  >
                    {{ deletingAttachment === attachment.id ? "..." : "🗑️" }}
                  </button>
                </div>
              </div>
            </div>

            <!-- File upload -->
            <div class="form-group">
              <label for="file-upload">افزودن فایل پیوست</label>
              <div class="file-upload-container">
                <input
                  id="file-upload"
                  ref="fileInput"
                  type="file"
                  multiple
                  @change="handleFileSelect"
                  class="file-input"
                />
                <label for="file-upload" class="file-upload-label">
                  📁 انتخاب فایل
                </label>
                <span v-if="newFiles.length" class="file-count">
                  {{ newFiles.length }} فایل انتخاب شده
                </span>
              </div>
              <div v-if="newFiles.length" class="new-files-list">
                <div
                  v-for="(file, index) in newFiles"
                  :key="index"
                  class="new-file-item"
                >
                  <span>{{ file.name }}</span>
                  <button
                    type="button"
                    @click="removeNewFile(index)"
                    class="remove-file-btn"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <!-- Error -->
            <Transition name="fade">
              <div v-if="error" class="error-message">{{ error }}</div>
            </Transition>

            <!-- Actions -->
            <div class="modal-actions">
              <button
                type="button"
                @click="handleClose"
                class="btn-cancel"
                :disabled="loading"
              >
                انصراف
              </button>
              <button type="submit" class="btn-submit" :disabled="loading">
                <span v-if="loading" class="loading-spinner"></span>
                <span v-else>
                  {{ isEditMode ? "ذخیره تغییرات" : "ایجاد یادداشت" }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, nextTick } from "vue";

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  note: { type: Object, default: null },
});

const emit = defineEmits(["close", "success"]);

const api = useApi();

const isEditMode = computed(() => !!props.note);

const formData = ref({ title: "", content: "", is_important: false });
const selectedTags = ref([]);
const tagInput = ref("");
const newFiles = ref([]);
const attachments = ref([]);

const fileInput = ref(null);
const titleInput = ref(null);
const tagInputEl = ref(null);

const loading = ref(false);
const deletingAttachment = ref(null);
const error = ref(null);

const resetForm = () => {
  formData.value = { title: "", content: "", is_important: false };
  selectedTags.value = [];
  tagInput.value = "";
  newFiles.value = [];
  attachments.value = [];
  error.value = null;
  if (fileInput.value) fileInput.value.value = "";
};

// Sync form when note changes
watch(
  () => props.note,
  (newNote) => {
    if (newNote) {
      formData.value = {
        title: newNote.title || "",
        content: newNote.content || "",
        is_important: newNote.is_important || false,
      };
      selectedTags.value = newNote.tags
        ? newNote.tags.map((t) => (typeof t === "string" ? t : t.name))
        : [];
      attachments.value = newNote.attachments || [];
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

// Autofocus title on open + lock body scroll
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = "hidden";
      nextTick(() => titleInput.value?.focus());
    } else {
      document.body.style.overflow = "";
    }
  },
);

// Close on Escape
const onKeydown = (e) => {
  if (e.key === "Escape" && props.isOpen) handleClose();
};
onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});

// Tags
const focusTagInput = () => tagInputEl.value?.focus();

const addTag = () => {
  const tag = tagInput.value.trim().replace(/,/g, "");
  if (tag && !selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
  }
  tagInput.value = "";
};

const removeTag = (index) => selectedTags.value.splice(index, 1);

const handleTagBackspace = () => {
  if (!tagInput.value && selectedTags.value.length) {
    selectedTags.value.pop();
  }
};

// Files
const handleFileSelect = (event) => {
  newFiles.value.push(...Array.from(event.target.files));
};

const removeNewFile = (index) => {
  newFiles.value.splice(index, 1);
  if (fileInput.value) fileInput.value.value = "";
};

const getFileName = (url) => (url ? url.split("/").pop() : "");

const removeAttachment = async (attachmentId) => {
  if (!confirm("آیا از حذف این فایل اطمینان دارید؟")) return;
  deletingAttachment.value = attachmentId;
  try {
    await api.delete(`/notes/attachments/${attachmentId}/`);
    attachments.value = attachments.value.filter((a) => a.id !== attachmentId);
  } catch (e) {
    error.value = e.message || "خطا در حذف فایل";
  } finally {
    deletingAttachment.value = null;
  }
};

const uploadAttachments = async (noteId) => {
  for (const file of newFiles.value) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("note", noteId);
    try {
      await api.post("/notes/attachments/", fd);
    } catch (e) {
      console.error("خطا در آپلود فایل:", file.name, e);
    }
  }
};

const handleSubmit = async () => {
  error.value = null;
  loading.value = true;
  try {
    const noteData = {
      title: formData.value.title,
      content: formData.value.content,
      is_important: formData.value.is_important,
      tags_input: selectedTags.value.join(", "),
    };

    let noteId;
    if (isEditMode.value) {
      await api.put(`/notes/${props.note.id}/`, noteData);
      noteId = props.note.id;
    } else {
      const data = await api.post("/notes/", noteData);
      noteId = data.id;
    }

    if (newFiles.value.length) {
      await uploadAttachments(noteId);
    }

    emit("success");
    handleClose();
  } catch (e) {
    error.value = e.message || "خطا در ثبت یادداشت";
    console.error("Submit error:", e);
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  if (!loading.value) {
    resetForm();
    emit("close");
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef3c7;
  color: #e39300;
  border-radius: 10px;
  font-size: 1.25rem;
  font-weight: 700;
}

.modal-header h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.close-btn:hover {
  background: #fee2e2;
  color: #991b1b;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #e39300;
  box-shadow: 0 0 0 3px rgba(227, 147, 0, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.char-count {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 0.75rem;
  color: #9ca3af;
}

.tags-input-container {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.5rem;
  min-height: 42px;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  cursor: text;
  transition: all 0.2s;
}
.tags-input-container:focus-within {
  border-color: #e39300;
  box-shadow: 0 0 0 3px rgba(227, 147, 0, 0.1);
}

.tag-chip {
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.remove-tag-btn {
  border: none;
  background: none;
  color: #92400e;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}
.remove-tag-btn:hover {
  color: #78350f;
}

.tags-input-container input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 120px;
  padding: 0.25rem;
  font-size: 0.95rem;
}

.help-text {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-left: 0.75rem;
  accent-color: #e39300;
}
.checkbox-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #374151;
}
.star-icon {
  font-size: 1.1rem;
}

.file-upload-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.file-input {
  display: none;
}
.file-upload-label {
  padding: 0.7rem 1.25rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.9rem;
}
.file-upload-label:hover {
  background: #e5e7eb;
}
.file-count {
  font-size: 0.9rem;
  color: #6b7280;
}

.attachments-list,
.new-files-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.attachment-item,
.new-file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #374151;
}

.remove-attachment-btn,
.remove-file-btn {
  border: none;
  background: #fee2e2;
  color: #991b1b;
  padding: 0.25rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}
.remove-attachment-btn:hover,
.remove-file-btn:hover {
  background: #fecaca;
}
.remove-attachment-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}
.btn-cancel:hover:not(:disabled) {
  background: #e5e7eb;
}
.btn-submit {
  background: #e39300;
  color: #fff;
}
.btn-submit:hover:not(:disabled) {
  background: #c27d00;
}
.btn-cancel:disabled,
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
