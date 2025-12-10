<template>
  <v-container>
    <h2>Videos</h2>

    <!-- Crear video solo admin -->
    <v-form v-if="user?.rol==='admin'" @submit.prevent="crearVideo">
      <v-text-field label="Título" v-model="nuevo.titulo"></v-text-field>
      <v-text-field label="URL" v-model="nuevo.url"></v-text-field>
      <v-textarea label="Descripción" v-model="nuevo.descripcion"></v-textarea>
      <v-btn color="success" type="submit">Crear Video</v-btn>
    </v-form>

    <v-row>
      <v-col cols="12" md="4" v-for="video in videos" :key="video.id">
        <v-card>
          <v-card-title>{{ video.titulo }}</v-card-title>
          <v-card-text>{{ video.descripcion }}</v-card-text>
          <v-card-actions>
            <v-btn v-if="user?.rol==='admin'" color="warning" @click="editarVideo(video)">Editar</v-btn>
            <v-btn v-if="user?.rol==='admin'" color="error" @click="eliminarVideo(video.id)">Eliminar</v-btn>
            <v-btn color="primary" :href="video.url" target="_blank">Ver Video</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api.js'
import { authStore } from '../services/auth.js'

const videos = ref([])
const nuevo = ref({ titulo: '', url: '', descripcion: '' })

// Computed reactivo para usuario logueado
const user = computed(() => authStore.user)

// Cargar videos
const cargarVideos = async () => {
  try {
    const res = await api.get('/videos/')
    videos.value = res.data
  } catch (error) {
    console.error('Error cargando videos:', error)
  }
}

// Crear video (solo admin)
const crearVideo = async () => {
  if (!user.value || user.value.rol !== 'admin') return alert('No tienes permisos')
  try {
    await api.post('/videos/', { ...nuevo.value })
    nuevo.value = { titulo: '', url: '', descripcion: '' }
    cargarVideos()
    alert('Video creado correctamente')
  } catch (error) {
    console.error('Error creando video:', error)
    alert(error.response?.data?.error || 'No se pudo crear el video')
  }
}

// Editar video (solo admin)
const editarVideo = async (video) => {
  if (!user.value || user.value.rol !== 'admin') return alert('No tienes permisos')
  const titulo = prompt('Nuevo título', video.titulo)
  if (!titulo) return
  try {
    await api.put(`/videos/${video.id}`, { titulo })
    cargarVideos()
    alert('Video actualizado')
  } catch (error) {
    console.error('Error editando video:', error)
  }
}

// Eliminar video (solo admin)
const eliminarVideo = async (id) => {
  if (!user.value || user.value.rol !== 'admin') return alert('No tienes permisos')
  if (!confirm('¿Eliminar video?')) return
  try {
    await api.delete(`/videos/${id}`)
    cargarVideos()
    alert('Video eliminado')
  } catch (error) {
    console.error('Error eliminando video:', error)
  }
}

onMounted(cargarVideos)
</script>
