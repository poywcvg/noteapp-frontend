<template>
  <article class="note-card" @click="$emit('edit', note)">
    <div class="card-header">
      <h3 class="note-title">{{ note.title || "بدون عنوان" }}</h3>
      <div class="card-actions" @click.stop>
        <button
          @click="$emit('archive', note.id)"
          class="icon-btn"
          title="بایگانی"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        </button>
        <button @click="$emit('delete', note.id)" class="icon-btn" title="حذف">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <p class="note-content">{{ truncate(note.content, 120) }}</p>

    <div class="card-footer">
      <div class="tags">
        <span
          v-for="tag in note.tags?.slice(0, 3)"
          :key="tag.id"
          class="tag"
          :style="{ backgroundColor: tagColor(tag.name) }"
        >
          {{ tag.name }}
        </span>
      </div>
      <time class="note-date">{{
        formatDate(note.updated_at || note.created_at)
      }}</time>
    </div>
  </article>
</template>

<script setup>
defineProps({
  note: Object,
});

defineEmits(["edit", "delete", "archive"]);

const truncate = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
};

const tagColor = (name) => {
  const colors = {
    فوری: "#FFE4E1",
    کاری: "#E0F2FE",
    شخصی: "#F3E8FF",
    فناوری: "#DBEAFE",
  };
  return colors[name] || "#F2E3D6";
};
</script>

<style scoped>
.note-card {
  background: #ffffff;
  border: 1px solid #e7e1d7;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.note-card:hover {
  border-color: #c4612f;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(31, 36, 33, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.note-title {
  font-family: "DM Serif Display", serif;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: #1f2421;
  margin: 0;
  flex: 1;
}

.card-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.note-card:hover .card-actions {
  opacity: 1;
}

.icon-btn {
  background: none;

  border: none;

  color: #5c635d;

  padding: 4px;

  cursor: pointer;

  border-radius: 4px;
}

.icon-btn:hover {
  background: #f2e3d6;

  color: #c4612f;
}

.note-content {
  font-size: 14px;
  line-height: 1.6;
  color: #5c635d;
  margin: 0 0 16px;
}

.card-footer {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-top: auto;
}

.tags {
  display: flex;

  gap: 6px;
}

.tag {
  font-size: 11px;

  padding: 2px 8px;

  border-radius: 4px;

  color: #5c635d;
}

.note-date {
  font-size: 11px;

  color: #a3a9a5;
}
</style>
