<template>
  <v-container>
    <h2>Noticias</h2>

    <!-- Crear noticia solo admin -->
    <v-form v-if="user?.rol==='admin'" @submit.prevent="crearNoticia">
      <v-text-field label="Título" v-model="nuevo.titulo"></v-text-field>
      <v-textarea label="Contenido" v-model="nuevo.contenido"></v-textarea>
      <v-select label="Tipo" :items="['informativa','evento']" v-model="nuevo.tipo"></v-select>
      <v-text-field label="Evento relacionado (ID)" v-model="nuevo.evento_id"></v-text-field>
      <v-btn color="success" type="submit">Crear Noticia</v-btn>
    </v-form>

    <v-row class="mt-4">
      <v-col cols="12" md="4" v-for="noticia in noticias" :key="noticia.id">
        <v-card>
          <v-card-title>{{ noticia.titulo }}</v-card-title>
          <v-card-text>
            {{ noticia.contenido }} <br>
            Autor: {{ noticia.autor }} <br>
            Tipo: {{ noticia.tipo }} <br>
            Evento: {{ noticia.evento_relacionado }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="warning" v-if="user?.rol==='admin'" @click="editarNoticia(noticia)">Editar</v-btn>
            <v-btn color="error" v-if="user?.rol==='admin'" @click="eliminarNoticia(noticia.id)">Eliminar</v-btn>
            <v-btn color="primary" v-if="user" @click="comentar(noticia.id)">Comentar</v-btn>
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

// Refs reactivos
const noticias = ref([])
const nuevo = ref({
  titulo: '',
  contenido: '',
  tipo: 'informativa',
  evento_id: ''
})

// Computed reactivo para usuario logueado
const user = computed(() => authStore.user)

// Cargar noticias
const cargarNoticias = async () => {
  try {
    const res = await api.get('/news/noticias')
    noticias.value = res.data
  } catch (error) {
    console.error('Error cargando noticias:', error)
  }
}

// Crear noticia (solo admin)
const crearNoticia = async () => {
  if (!user.value || user.value.rol !== 'admin') return alert('No tienes permisos')
  try {
    const payload = {
      titulo: nuevo.value.titulo,
      contenido: nuevo.value.contenido,
      tipo: nuevo.value.tipo,
      evento_id: nuevo.value.evento_id || null
    }
    await api.post('/news/noticias', payload, { withCredentials: true })
    nuevo.value = { titulo: '', contenido: '', tipo: 'informativa', evento_id: '' }
    cargarNoticias()
    alert('Noticia creada correctamente')
  } catch (error) {
    console.error('Error creando noticia:', error)
    alert(error.response?.data?.error || 'No se pudo crear la noticia')
  }
}

// Editar noticia (solo admin)
const editarNoticia = async (noticia) => {
  if (!user.value || user.value.rol !== 'admin') return alert('No tienes permisos')
  const titulo = prompt('Nuevo título', noticia.titulo)
  if (!titulo) return
  try {
    await api.put(`/news/noticias/${noticia.id}`, { titulo })
    cargarNoticias()
    alert('Noticia actualizada')
  } catch (error) {
    console.error('Error editando noticia:', error)
  }
}

// Eliminar noticia (solo admin)
const eliminarNoticia = async (id) => {
  if (!user.value || user.value.rol !== 'admin') return alert('No tienes permisos')
  if (!confirm('¿Eliminar noticia?')) return
  try {
    await api.delete(`/news/noticias/${id}`)
    cargarNoticias()
    alert('Noticia eliminada')
  } catch (error) {
    console.error('Error eliminando noticia:', error)
  }
}

// Comentar noticia (usuarios)
const comentar = async (id) => {
  if (!user.value) return alert('Debes iniciar sesión para comentar')
  const texto = prompt('Escribe tu comentario')
  if (!texto) return
  try {
    await api.post(`/news/noticias/${id}/comentarios`, { texto })
    alert('Comentario agregado')
  } catch (error) {
    console.error('Error agregando comentario:', error)
  }
}

onMounted(cargarNoticias)
</script>
