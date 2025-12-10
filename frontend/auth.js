import { reactive } from 'vue'
import api from './api.js'

export const authStore = reactive({
  user: null,

  setUser(u) {
    this.user = u
    sessionStorage.setItem('user', JSON.stringify(u))
    return u
  },

  logout() {
    this.user = null
    sessionStorage.removeItem('user')
  },

  fetchUser: async function() {
    try {
      const res = await api.get('/users/session') // envía cookies automáticamente
      if (res.data.usuario) {
        return this.setUser(res.data.usuario)
      }
      this.logout()
      return null
    } catch {
      this.logout()
      return null
    }
  }
})

// Inicializa desde sessionStorage
authStore.user = JSON.parse(sessionStorage.getItem('user') || 'null')
