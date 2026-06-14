<script setup>
import { API } from "~/constants/api";

const api = useApi();

const notes = ref([]);
const loading = ref(false);
const errorMessage = ref("");

const getArchivedNotes = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    notes.value = await api(API.notes.archived);
  } catch (error) {
    console.log(error);

    if (error?.status === 403 || error?.status === 401) {
      errorMessage.value = "ابتدا وارد حساب کاربری شوید";
      navigateTo("/login");
      return;
    }

    errorMessage.value = "خطا در دریافت آرشیو";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getArchivedNotes();
});
</script>

<template>
  <section>
    <h1>آرشیو</h1>

    <p v-if="loading">در حال دریافت...</p>

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>

    <div class="notes-grid">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        :show-archive="false"
      />
    </div>
  </section>
</template>

<style scoped>
h1 {
  margin-bottom: 24px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 18px;
}

.error {
  color: red;
}
</style>
