import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from '../services/auth.js'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import LoginCallback from '../views/LoginCallback.vue'
import ImagenesView from '../views/ImagenesView.vue'
import EventosView from '../views/EventosView.vue'
import NoticiasView from '../views/NoticiasView.vue'
import VideosView from '../views/VideosView.vue'
import MisInscripciones from '../views/MisInscripciones.vue'
import AdminPanel from '../views/AdminPanel.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/login/callback', component: LoginCallback },
  { path: '/imagenes', component: ImagenesView, meta: { requiresAdmin: true } },
  { path: '/eventos', component: EventosView },
  { path: '/noticias', component: NoticiasView },
  { path: '/videos', component: VideosView, meta: { requiresAdmin: true } },
  { path: '/mis-inscripciones', component: MisInscripciones, meta: { requiresUser: true } },
  { path: '/admin', component: AdminPanel, meta: { requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Protección de rutas
router.beforeEach(async (to) => {
  // Asegura que authStore.user esté actualizado
  if (!authStore.user) {
    try {
      await authStore.fetchUser() // Esto traerá el usuario desde backend si hay sesión
    } catch {
      authStore.logout()
    }
  }

  const user = authStore.user

  // Rutas que requieren usuario logueado
  if (to.meta.requiresUser && !user) return '/login'

  // Rutas que requieren admin
  if (to.meta.requiresAdmin && (!user || user.rol !== 'admin')) return '/'

  return true
})


export default router
