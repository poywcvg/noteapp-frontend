export const useAttachments = () => {
  const { post, delete: del } = useApi()

  const uploadAttachment = async (noteId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('note', noteId)

    // FormData خودش Content-Type رو تنظیم می‌کنه، پس headers نذار
    return await post('/notes/attachments/', formData)
  }

  const deleteAttachment = async (attachmentId) => {
    return await del(`/notes/attachments/${attachmentId}/`)
  }

  return {
    uploadAttachment,
    deleteAttachment,
  }
}
