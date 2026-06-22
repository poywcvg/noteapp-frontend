export const API_BASE_URL = 'http://localhost:8000'  // تغییر از 127.0.0.1 به localhost

export const API_ENDPOINTS = {
  auth: {
    login: '/login/',
    logout: '/logout/',
    me: '/me/',
    register: '/register/',
    refresh: '/api/token/refresh/',
    jwtToken: '/api/token/',
    jwtRefresh: '/api/token/refresh/',
  },

  notes: {
    list: '/notes/',
    create: '/notes/',
    detail: (id) => `/notes/${id}/`,
    update: (id) => `/notes/${id}/`,
    patch: (id) => `/notes/${id}/`,
    delete: (id) => `/notes/${id}/`,
    archive: (id) => `/notes/${id}/archive/`,
    restore: (id) => `/notes/${id}/restore/`,
    hardDelete: (id) => `/notes/${id}/hard_delete/`,
    archived: '/notes/archived/',
    deleted: '/notes/deleted/',
  },

  attachments: {
    list: '/notes/attachments/',
    create: '/notes/attachments/',
    detail: (id) => `/notes/attachments/${id}/`,
    update: (id) => `/notes/attachments/${id}/`,
    patch: (id) => `/notes/attachments/${id}/`,
    delete: (id) => `/notes/attachments/${id}/`,
  },
}
