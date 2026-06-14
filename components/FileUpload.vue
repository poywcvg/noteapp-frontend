<script setup>
const props = defineProps({
  noteId: { type: [Number, String], required: true },
});
const emit = defineEmits(["uploaded"]);

const { uploadAttachment } = useAttachments();
const uploading = ref(false);
const error = ref("");

async function onFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  uploading.value = true;
  error.value = "";
  try {
    const result = await uploadAttachment(props.noteId, file);
    emit("uploaded", result);
  } catch (e) {
    error.value = "خطا در آپلود فایل";
    console.error(e);
  } finally {
    uploading.value = false;
    event.target.value = "";
  }
}
</script>

<template>
  <div>
    <label class="upload-btn">
      <input type="file" hidden @change="onFileChange" :disabled="uploading" />
      {{ uploading ? "در حال آپلود..." : "افزودن پیوست" }}
    </label>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
