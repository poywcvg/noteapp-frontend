<!-- components/AttachmentList.vue -->
<script setup>
const props = defineProps({
  attachments: { type: Array, default: () => [] },
});
const emit = defineEmits(["deleted"]);

const { deleteAttachment } = useAttachments();

async function remove(id) {
  await deleteAttachment(id);
  emit("deleted", id);
}

function fileName(url) {
  return url?.split("/").pop();
}
</script>

<template>
  <ul class="attachment-list">
    <li v-for="att in attachments" :key="att.id">
      <a :href="att.file" target="_blank">{{ fileName(att.file) }}</a>
      <button @click="remove(att.id)">حذف</button>
    </li>
    <li v-if="attachments.length === 0">پیوستی وجود ندارد</li>
  </ul>
</template>
