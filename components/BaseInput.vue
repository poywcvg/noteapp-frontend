<script setup>
defineProps({
    note: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['archive'])
</script>

<template>
    <article class="note-card">
        <h3>{{ note.title }}</h3>

        <p>{{ note.content }}</p>

        <div class="tags">
            <span v-for="tag in note.tags" :key="tag.id || tag.name">
                {{ tag.name || tag }}
            </span>
        </div>

        <button @click="emit('archive', note.id)">
            آرشیو
        </button>
    </article>
</template>

<style scoped>
.note-card {
    background: white;
    padding: 18px;
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin: 12px 0;
}

.tags span {
    background: #e5e7eb;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 13px;
}

button {
    width: 100%;
    padding: 10px;
    border: none;
    background: #1f2937;
    color: white;
    border-radius: 8px;
}
</style>