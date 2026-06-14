<template>
  <article class="note-card">
    <h3>{{ note.title }}</h3>

    <p v-if="note.content">
      {{ note.content }}
    </p>

    <p v-else class="muted">برای دیدن متن کامل، ویرایش را بزنید</p>

    <div class="tags">
      <span v-for="tag in note.tags" :key="tag.id" class="tag">
        {{ tag.name }}
      </span>
    </div>

    <div class="actions">
      <button class="edit-btn" @click="editNote">ویرایش</button>

      <button class="archive-btn" @click="$emit('archive', note.id)">
        آرشیو
      </button>

      <button class="delete-btn" @click="$emit('delete', note.id)">حذف</button>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  note: {
    type: Object,
    required: true,
  },
});

defineEmits(["archive", "delete"]);

const editNote = () => {
  navigateTo({
    path: "/edit-note",
    query: {
      id: props.note.id,
    },
  });
};
</script>

<style scoped>
.note-card {
  background: white;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

h3 {
  margin-bottom: 10px;
}

p {
  color: #4b5563;
  line-height: 1.7;
}

.muted {
  color: #9ca3af;
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

.actions button {
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.edit-btn {
  background: #2563eb;
  color: white;
}

.archive-btn {
  background: #f59e0b;
  color: white;
}

.delete-btn {
  background: #dc2626;
  color: white;
}
</style>
