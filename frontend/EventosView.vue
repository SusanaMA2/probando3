<template>
  <v-container>
    <h2>Eventos</h2>

    <v-alert v-if="cargando">Cargando eventos...</v-alert>
    <v-alert v-else-if="!user">Inicia sesión para ver eventos</v-alert>

    <!-- Crear evento solo admin -->
    <v-form v-if="user?.rol === 'admin'" @submit.prevent="crearEvento">
      <v-text-field label="Título" v-model="nuevo.titulo"></v-text-field>
      <v-textarea label="Descripción" v-model="nuevo.descripcion"></v-textarea>
      <v-text-field label="Ubicación" v-model="nuevo.ubicacion"></v-text-field>
      <v-text-field label="Cupos" type="number" v-model="nuevo.cupos"></v-text-field>
      <v-text-field label="Fecha evento (YYYY-MM-DD HH:MM:SS)" v-model="nuevo.fecha_evento"></v-text-field>
      <v-btn color="success" type="submit">Crear Evento</v-btn>
    </v-form>

    <v-row v-if="user && eventos.length">
      <v-col cols="12" md="4" v-for="evento in eventos" :key="evento.id">
        <v-card>
          <v-card-title>{{ evento.titulo }}</v-card-title>
          <v-card-text>
            {{ evento.descripcion }} <br>
            Fecha: {{ evento.fecha_evento }} <br>
            Ubicación: {{ evento.ubicacion }} <br>
            Cupos: {{ evento.cupos }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" v-if="user?.rol === 'user'" @click="inscribirse(evento.id)">
              Inscribirse
            </v-btn>
            <v-btn color="warning" v-if="user?.rol === 'admin'" @click="editarEvento(evento.id)">
              Editar
            </v-btn>
            <v-btn color="error" v-if="user?.rol === 'admin'" @click="eliminarEvento(evento.id)">
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { authStore } from '../services/auth.js'
import api from '../services/api.js'

const eventos = ref([])
const nuevo = ref({ titulo: '', descripcion: '', ubicacion: '', cupos: '', fecha_evento: '' })
const cargando = ref(true)

// Computed reactivo para el usuario
const user = computed(() => authStore.user)

const cargarEventos = async () => {
  try {
    const res = await api.get('/events/', { withCredentials: true })
    eventos.value = res.data
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.error || 'Error al cargar eventos')
  }
}

// Funciones CRUD
const crearEvento = async () => {
  try {
    await api.post('/events/', { ...nuevo.value }, { withCredentials: true })
    nuevo.value = { titulo: '', descripcion: '', ubicacion: '', cupos: '', fecha_evento: '' }
    cargarEventos()
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.error || 'Error al crear evento')
  }
}

const editarEvento = async (id) => {
  const titulo = prompt('Nuevo título')
  if (!titulo) return
  try {
    await api.put(`/events/${id}`, { titulo }, { withCredentials: true })
    cargarEventos()
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.error || 'Error al editar evento')
  }
}

const eliminarEvento = async (id) => {
  if (!confirm('¿Eliminar evento?')) return
  try {
    await api.delete(`/events/${id}`, { withCredentials: true })
    cargarEventos()
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.error || 'Error al eliminar evento')
  }
}

const inscribirse = async (id) => {
  try {
    await api.post(`/events/${id}/inscribirse`, {}, { withCredentials: true })
    alert('Inscripción exitosa')
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.error || 'Error al inscribirse')
  }
}

// Esperar a que authStore cargue la sesión antes de mostrar eventos
onMounted(async () => {
  await authStore.fetchUser()
  if (authStore.user) await cargarEventos()
  cargando.value = false
})
</script>
