<template>
  <div class="trash-page">
    <div class="header">
      <h1>سطل زباله</h1>
      <p class="subtitle">یادداشت‌های حذف شده</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>در حال بارگذاری...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchNotes" class="retry-btn">تلاش مجدد</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!notes.length" class="empty-state">
      <div class="empty-icon">🗑️</div>
      <h2>سطل زباله خالی است</h2>
      <p>یادداشت حذف شده‌ای وجود ندارد</p>
    </div>

    <!-- Notes Grid -->
    <div v-else class="notes-grid">
      <div v-for="note in notes" :key="note.id" class="note-card">
        <div class="note-header">
          <h3 class="note-title">{{ note.title }}</h3>
          <span v-if="note.is_important" class="important-badge">⭐</span>
        </div>
        
        <p class="note-content">{{ truncateContent(note.content) }}</p>
        
        <div class="note-tags" v-if="note.tags && note.tags.length">
          <span v-for="tag in note.tags" :key="tag.id" class="tag">
            {{ tag.name }}
          </span>
        </div>
        
        <div class="note-meta">
          <span class="date">حذف شده: {{ formatDate(note.deleted_at) }}</span>
        </div>

        <div class="note-actions">
          <button 
            @click="restoreNote(note.id)" 
            class="action-btn restore-btn"
            :disabled="actionLoading[note.id]"
          >
            <span v-if="actionLoading[note.id]">...</span>
            <span v-else>↩️ بازگردانی</span>
          </button>
          <button 
            @click="confirmHardDelete(note)" 
            class="action-btn delete-btn"
            :disabled="actionLoading[note.id]"
          >
            <span v-if="actionLoading[note.id]">...</span>
            <span v-else>🗑️ حذف دائمی</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <h2>حذف دائمی یادداشت</h2>
        <p>آیا مطمئن هستید که می‌خواهید این یادداشت را برای همیشه حذف کنید؟</p>
        <p class="warning">⚠️ این عملیات قابل بازگشت نیست!</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="cancel-btn">انصراف</button>
          <button @click="hardDeleteNote" class="confirm-delete-btn">حذف دائمی</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'default'
})

const notes = ref([])
const loading = ref(false)
const error = ref(null)
const actionLoading = ref({})
const showDeleteModal = ref(false)
const selectedNote = ref(null)

const fetchNotes = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('http://localhost:8000/api/notes/?is_deleted=true', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (!response.ok) throw new Error('خطا در دریافت یادداشت‌ها')
    
    const data = await response.json()
    notes.value = data.results || data
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const restoreNote = async (noteId) => {
  actionLoading.value[noteId] = true
  
  try {
    const response = await fetch(`http://localhost:8000/api/notes/${noteId}/restore/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) throw new Error('خطا در بازگردانی یادداشت')
    
    // Remove from list
    notes.value = notes.value.filter(n => n.id !== noteId)
  } catch (e) {
    alert(e.message)
  } finally {
    actionLoading.value[noteId] = false
  }
}

const confirmHardDelete = (note) => {
  selectedNote.value = note
  showDeleteModal.value = true
}

const hardDeleteNote = async () => {
  const noteId = selectedNote.value.id
  actionLoading.value[noteId] = true
  showDeleteModal.value = false
  
  try {
    const response = await fetch(`http://localhost:8000/api/notes/${noteId}/hard_delete/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (!response.ok) throw new Error('خطا در حذف یادداشت')
    
    // Remove from list
    notes.value = notes.value.filter(n => n.id !== noteId)
    selectedNote.value = null
  } catch (e) {
    alert(e.message)
  } finally {
    actionLoading.value[noteId] = false
  }
}

const truncateContent = (content) => {
  if (!content) return ''
  return content.length > 150 ? content.substring(0, 150) + '...' : content
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

onMounted(() => {
  fetchNotes()
})
</script>

<style scoped>
.trash-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #E39300;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #ef4444;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #E39300;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
}

.retry-btn:hover {
  background: #c27d00;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
}

/* Notes Grid */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.note-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.note-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
}

.important-badge {
  font-size: 1rem;
}

.note-content {
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  opacity: 0.7;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.note-meta {
  font-size: 0.85rem;
  color: #9ca3af;
}

.note-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.action-btn {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.restore-btn {
  background: #10b981;
  color: white;
}

.restore-btn:hover:not(:disabled) {
  background: #059669;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover:not(:disabled) {
  background: #dc2626;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
}

.modal-content h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.modal-content p {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.warning {
  color: #ef4444;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn,
.confirm-delete-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
}

.cancel-btn {
  background: #f3f4f6;
  color: #1f2937;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.confirm-delete-btn {
  background: #ef4444;
  color: white;
}

.confirm-delete-btn:hover {
  background: #dc2626;
}
</style>
