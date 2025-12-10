<template>
  <v-container class="pa-4 d-flex flex-column align-center">
    <v-progress-circular indeterminate color="primary" class="mb-2"></v-progress-circular>
    <p>Procesando login...</p>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../services/auth.js'
import api from '../services/api.js' // <- tu apiClient corregido

const router = useRouter()

onMounted(async () => {
  try {
    const res = await api.get('/users/session') // con withCredentials: true
    console.log('Respuesta sesión:', res.data)  // <--- verifica aquí

    if (!res.data.usuario) throw new Error('No hay usuario logueado')

    authStore.setUser(res.data.usuario)

    // Redirigir según rol
    if (res.data.usuario.rol === 'admin') router.replace('/admin')
    else router.replace('/')
  } catch (err) {
    console.error('Login fallido:', err)
    router.replace('/login')
  }
})

</script>
