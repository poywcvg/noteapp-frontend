<template>
  <div class="note-grid">
    <NoteCard
      v-for="note in notes"
      :key="note.id"
      :note="note"
      @edit="$emit('edit', note)"
      @delete="$emit('delete', note.id)"
    />
  </div>
</template>

<script setup>
defineProps(["notes"]);
defineEmits(["edit", "delete"]);
</script>

<style scoped>
.note-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}
</style>
