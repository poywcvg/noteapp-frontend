<template>
  <main class="page">
    <section v-if="isLoading && !currentNote" class="state">
      در حال دریافت یادداشت...
    </section>

    <section v-else-if="error && !currentNote" class="state error">
      {{ error }}
    </section>
    <section v-else-if="currentNote" class="note-detail">
      <header class="detail-header">
        <button class="back-btn" @click="navigateTo('/')">
          بازگشت
        </button>

        <div class="actions">
          <button class="btn secondary" @click="showEditModal = true">
            ویرایش
          </button>

          <button
            v-if="!currentNote.is_archived"
            class="btn secondary"
            @click="handleArchive"
          >
            آرشیو
          </button>

          <button
            v-else
            class="btn secondary"
            @click="handleUnarchive"
          >
            خروج از آرشیو
          </button>

          <button class="btn danger" @click="handleDelete">
            حذف
          </button>
        </div>
      </header>

      <article class="content-box">
        <h1>{{ currentNote.title || 'بدون عنوان' }}</h1>

        <p class="date">
          آخرین بروزرسانی:
          {{ formatDate(currentNote.updated_at || currentNote.created_at) }}
        </p>

        <div v-if="currentNote.tags?.length" class="tags">
          <span v-for="tag in currentNote.tags" :key="tag.id || tag">
            {{ tag.name || tag }}
          </span>
        </div>

        <div class="note-content">
          {{ currentNote.content || currentNote.body || 'متنی ثبت نشده است.' }}
        </div>
      </article>

      <section class="attachments">
        <h2>فایل‌های ضمیمه</h2>

        <input type="file" @change="handleUpload" />

        <div v-if="currentNote.attachments?.length" class="attachment-list">
          <div
            v-for="file in currentNote.attachments"
            :key="file.id"
            class="attachment-item"
          >
            <a :href="getFileUrl(file.file)" target="_blank">
              {{ getFileName(file.file) }}
            </a>

            <button @click="handleDeleteAttachment(file.id)">
              حذف
            </button>
          </div>
        </div>

        <p v-else class="empty">
          فایلی ضمیمه نشده است.
        </p>
      </section>

      <NoteFormModal
        v-model="showEditModal"
        :note="currentNote"
        :loading="isSubmitting"
        mode="edit"
        @submit="handleUpdate"
      />
    </section>
  </main>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

const {
  currentNote,
  isLoading,
  error,
  fetchNoteById,
  updateNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
  uploadAttachment,
  deleteAttachment,
} = useNotes()

const showEditModal = ref(false)
const isSubmitting = ref(false)

const noteId = computed(() => route.params.id)

const formatDate = (value) => {
  if (!value) return '-'

  try {
    return new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return '-'
  }
}

const getFileUrl = (file) => {
  if (!file) return '#'
  if (file.startsWith('http')) return file

  const apiBase = config.public.apiBase || ''
  const origin = apiBase.replace('/api', '')

  return `${origin}${file}`
}

const getFileName = (file) => {
  if (!file) return 'فایل'
  return file.split('/').pop()
}

const handleUpdate = async (payload) => {
  isSubmitting.value = true

  try {
    await updateNote(Number(noteId.value), payload)
    showEditModal.value = false
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  const ok = confirm('آیا از حذف این یادداشت مطمئن هستید؟')
  if (!ok) return

  await deleteNote(Number(noteId.value))
  await navigateTo('/')
}

const handleArchive = async () => {
  await archiveNote(Number(noteId.value))
}

const handleUnarchive = async () => {
  await unarchiveNote(Number(noteId.value))
}

const handleUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  await uploadAttachment(Number(noteId.value), file)
  event.target.value = ''
}

const handleDeleteAttachment = async (id) => {
  await deleteAttachment(id)
}

onMounted(async () => {
  await fetchNoteById(Number(noteId.value))
})
</script>

<style scoped>
.page {
  padding: 28px;
}

.state {
  background: #fff7ee;
  border: 1px solid #ebddcc;
  border-radius: 20px;
  padding: 22px;
}

.state.error {
  color: #b42318;
}

.note-detail {
  display: grid;
  gap: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.back-btn,
.btn {
  border: none;
  border-radius: 13px;
  padding: 10px 15px;
  font-weight: 900;
  cursor: pointer;
}

.back-btn,
.btn.secondary {
  background: #eee5db;
  color: #5d5147;
}

.btn.danger {
  background: #fee4e2;
  color: #b42318;
}

.content-box,
.attachments {
  background: #fffaf5;
  border: 1px solid #eadfce;
  border-radius: 24px;
  padding: 24px;
}

.content-box h1 {
  margin: 0 0 8px;
  font-size: 34px;
}

.date {
  margin: 0 0 18px;
  color: #9a8d82;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.tags span {
  background: #f0dfca;
  color: #6d5035;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 13px;
  font-weight: 800;
}

.note-content {
  white-space: pre-wrap;
  line-height: 2;
  color: #3f332b;
}

.attachments h2 {
  margin-top: 0;
}

.attachment-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  background: white;
  border-radius: 14px;
  padding: 12px;
}

.attachment-item button {
  border: none;
  background: #fee4e2;
  color: #b42318;
  border-radius: 10px;
  padding: 6px 10px;
  cursor: pointer;
}

.empty {
  color: #8a7b70;
}
</style>
