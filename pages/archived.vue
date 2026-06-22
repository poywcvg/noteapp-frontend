<template>
  <main class="page-container">
    <h1>آرشیو</h1>

    <div v-if="archivedNotes.length">
      <article v-for="note in archivedNotes" :key="note.id" class="note-card">
        <h3>{{ note.title }}</h3>
        <p>{{ note.content }}</p>
        <button @click="handleRestore(note.id)">بازگردانی</button>
      </article>
    </div>

    <p v-else>یادداشت آرشیوشده‌ای وجود ندارد.</p>
  </main>
</template>

<script setup>
const { initAuth, isAuthenticated } = useAuth()
const { archivedNotes, fetchArchivedNotes, restoreNote } = useNotes()

onMounted(async () => {
  initAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  await fetchArchivedNotes()
})

const handleRestore = async (id) => {
  await restoreNote(id)
  await fetchArchivedNotes()
}
</script>
