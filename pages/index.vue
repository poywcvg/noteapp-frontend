<script setup>
import { ref, onMounted } from 'vue'
import { API } from '~/constants/api.js'
import { useApi } from '~/composables/useApi.js'

const api = useApi()
const notes = ref([])
const errorMessage = ref('')

// دریافت یادداشت‌ها
const loadNotes = async () => {
  try {
    const { data } = await api.get(API.notes.list)
    notes.value = data
  } catch (error) {
    console.error(error)
    errorMessage.value = 'خطا در دریافت یادداشت‌ها'
  }
}

// آرشیو کردن یادداشت
const archiveNote = async (id) => {
  try {
    await api.post(API.notes.archive(id))
    notes.value = notes.value.filter(n => n.id !== id)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'خطا در آرشیو کردن یادداشت'
  }
}

// وقتی صفحه لود شد، یادداشت‌ها را دریافت کن
onMounted(() => {
  loadNotes()
})
</script>

<template>
  <div class="notes-page">
    <h1>یادداشت‌ها</h1>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div class="notes-list">
      <div v-for="note in notes" :key="note.id" class="note-card">
        <h3>{{ note.title }}</h3>
        <p>{{ note.content }}</p>
        <div class="tags">
          <span v-for="tag in note.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
        </div>
        <button @click="archiveNote(note.id)">آرشیو</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notes-page {
  max-width: 900px;
  margin: 20px auto;
  padding: 10px;
}

.error {
  color: red;
  margin-bottom: 10px;
}

.notes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.note-card {
  background: #f7f7f7;
  padding: 15px;
  border-radius: 8px;
  width: 250px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.note-card h3 {
  margin: 0 0 10px;
}

.note-card .tags {
  margin: 10px 0;
}

.tag {
  display: inline-block;
  background: #d1e7dd;
  color: #0f5132;
  padding: 3px 8px;
  border-radius: 5px;
  margin-right: 5px;
  font-size: 12px;
}

.note-card button {
  background: #1f2937;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}
</style>