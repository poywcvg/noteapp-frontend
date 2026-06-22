// composables/useNotes.js
import { API_ENDPOINTS } from '~/constants/api'

export const useNotes = () => {
  const api = useApi()
  const notes = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchNotes = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const queryString = new URLSearchParams(params).toString()
      const url = queryString ? `${API_ENDPOINTS.notes.list}?${queryString}` : API_ENDPOINTS.notes.list
      const data = await api.get(url)
      notes.value = data
      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const getNote = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await api.get(API_ENDPOINTS.notes.detail(id))
      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const createNote = async (noteData) => {
    loading.value = true
    error.value = null
    try {
      // تبدیل tags به tags_input
      const payload = {
        title: noteData.title,
        content: noteData.content,
        is_important: noteData.is_important || false
      }

      if (noteData.tags && noteData.tags.length > 0) {
        payload.tags_input = noteData.tags.join(', ')
      }

      const data = await api.post(API_ENDPOINTS.notes.create, payload)
      notes.value.unshift(data)
      return data
    } catch (err) {
      error.value = err
      console.error('Create note error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateNote = async (id, noteData) => {
    loading.value = true
    error.value = null
    try {
      const payload = {
        title: noteData.title,
        content: noteData.content,
        is_important: noteData.is_important || false
      }

      if (noteData.tags && noteData.tags.length > 0) {
        payload.tags_input = noteData.tags.join(', ')
      }

      const data = await api.patch(API_ENDPOINTS.notes.patch(id), payload)
      const index = notes.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notes.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteNote = async (id) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(API_ENDPOINTS.notes.delete(id))
      notes.value = notes.value.filter(n => n.id !== id)
      return true
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const archiveNote = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await api.post(API_ENDPOINTS.notes.archive(id))
      const index = notes.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notes.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const unarchiveNote = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await api.post(API_ENDPOINTS.notes.unarchive(id))
      const index = notes.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notes.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const trashNote = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await api.post(API_ENDPOINTS.notes.trash(id))
      notes.value = notes.value.filter(n => n.id !== id)
      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const restoreNote = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await api.post(API_ENDPOINTS.notes.restore(id))
      notes.value = notes.value.filter(n => n.id !== id)
      return data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const permanentDeleteNote = async (id) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(API_ENDPOINTS.notes.permanentDelete(id))

      notes.value = notes.value.filter(n => n.id !== id)

      return true

    } catch (err) {

      error.value = err

      throw err

    } finally {

      loading.value = false

    }

  }

  return {

    notes,

    loading,

    error,

    fetchNotes,

    getNote,

    createNote,

    updateNote,

    deleteNote,

    archiveNote,

    unarchiveNote,

    trashNote,

    restoreNote,

    permanentDeleteNote

  }

}