export const API = {
  auth: {
    login: '/api/token/',
    register: '/register/',
    me: '/me/',
    logout: '/logout/'
  },

  notes: {
    list: '/notes/notes/',
    create: '/notes/notes/',
    archived: '/notes/notes/archived/',
    deleted: '/notes/notes/deleted/',

    detail: (id) => `/notes/notes/${id}/`,
    update: (id) => `/notes/notes/${id}/`,
    archive: (id) => `/notes/notes/${id}/archive/`,
    restore: (id) => `/notes/notes/${id}/restore/`,
    hardDelete: (id) => `/notes/notes/${id}/hard_delete/`,
    delete: (id) => `/notes/notes/${id}/`
  }
}