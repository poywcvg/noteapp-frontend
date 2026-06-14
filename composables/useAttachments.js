export const useAttachments = () => {
    const config = useRuntimeConfig()
    const { accessToken } = useAuth()

    const baseURL = config.public.apiBase

    const uploadAttachment = async (noteId, file) => {
        const formData = new FormData()
        formData.append('note', noteId)
        formData.append('file', file)

        return await $fetch('/attachments/', {
            baseURL,
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${accessToken.value}`
            }
        })
    }

    const getAttachments = async (noteId) => {
        return await $fetch('/attachments/', {
            baseURL,
            method: 'GET',
            params: { note: noteId },
            headers: { Authorization: `Bearer ${accessToken.value}` }
        })
    }

    const deleteAttachment = async (attachmentId) => {
        return await $fetch(`/attachments/${attachmentId}/`, {
            baseURL,
            method: 'DELETE',
            headers: { Authorization: `Bearer ${accessToken.value}` }
        })
    }

    return {
        uploadAttachment,
        getAttachments,
        deleteAttachment
    }
}
