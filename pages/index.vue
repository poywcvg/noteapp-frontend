<!-- index.vue -->
<template>
  <div class="notes-page">
    <div class="page-header">
      <h1>یادداشت‌های من</h1>
      <button @click="openCreateModal" class="btn-create">
        + یادداشت جدید
      </button>
    </div>
    <!-- Notes Grid -->
    <div v-if="!loading && notes.length" class="notes-grid">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @edit="openEditModal"
        @archive="handleArchive"
        @delete="handleDelete"
      />
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>در حال بارگذاری...</p>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">📝</div>
      <h2>هنوز یادداشتی ندارید</h2>
      <p>با کلیک روی دکمه "یادداشت جدید" شروع کنید</p>
    </div>

    <!-- Note Modal -->
    <NoteModal
      :is-open="isModalOpen"
      :note="selectedNote"
      @close="closeModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NoteModal from "~/components/NoteModal.vue";
import NoteCard from "~/components/NoteCard.vue";
definePageMeta({
  layout: "default",
});
const handleArchive = async (id) => {
  console.log("آرشیو یادداشت:", id);
};
const notes = ref([]);
const loading = ref(false);
const isModalOpen = ref(false);
const selectedNote = ref(null);

const fetchNotes = async () => {
  loading.value = true;
  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این یادداشت اطمینان دارید؟")) return;

    try {
      const token =
        localStorage.getItem("access_token") || localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/notes/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        notes.value = notes.value.filter((n) => n.id !== id);
      }
    } catch (error) {
      console.error("خطا در حذف:", error);
    }
  };
  try {
    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token");

    const response = await fetch("http://localhost:8000/notes/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("خطا در دریافت یادداشت‌ها");

    const data = await response.json();
    notes.value = data.results || data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  selectedNote.value = null;
  isModalOpen.value = true;
};

const openEditModal = async (note) => {
  loading.value = true;
  try {
    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token");
    const response = await fetch(`http://localhost:8000/notes/${note.id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("خطا در دریافت جزئیات");

    const fullNote = await response.json();

    selectedNote.value = {
      id: fullNote.id,
      title: fullNote.title || "",
      content: fullNote.content || "", // ← حالا content واقعی داره
      tags: fullNote.tags || [],
    };

    isModalOpen.value = true;
  } catch (error) {
    console.error("خطا:", error);
    alert("خطا در بارگذاری یادداشت");
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedNote.value = null;
};

const handleSuccess = () => {
  fetchNotes();
};

const truncateContent = (content) => {
  if (!content) return "";
  return content.length > 150 ? content.substring(0, 150) + "..." : content;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR").format(date);
};

onMounted(() => {
  fetchNotes();
});
</script>

<style scoped>
.notes-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.btn-create {
  padding: 0.75rem 1.5rem;
  background: #e39300;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-create:hover {
  background: #c27d00;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(227, 147, 0, 0.3);
}

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
  cursor: pointer;
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

.note-footer {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.note-date {
  font-size: 0.85rem;
  color: #9ca3af;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #e39300;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
</style>
