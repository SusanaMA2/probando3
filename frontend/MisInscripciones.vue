<template>
  <v-container>
    <h2>Mis Inscripciones</h2>

    <!-- Mensaje si no hay usuario logueado -->
    <p v-if="!user">Debes iniciar sesión para ver tus inscripciones.</p>

    <!-- Lista de inscripciones -->
    <v-list v-else>
      <v-list-item v-for="i in inscripciones" :key="i.evento">
        <v-list-item-content>
          <v-list-item-title>{{ i.evento }}</v-list-item-title>
          <v-list-item-subtitle>
            Fecha evento: {{ i.fecha_evento }} | Inscripción: {{ i.fecha_inscripcion }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api.js'
import { authStore } from '../services/auth.js'

// Refs reactivos
const inscripciones = ref([])

// Computed reactivo para usuario logueado
const user = computed(() => authStore.user)

// Función para cargar inscripciones solo si hay usuario
const cargarInscripciones = async () => {
  if (!user.value) return
  try {
    const res = await api.get('/events/mis-inscripciones')
    inscripciones.value = res.data
  } catch (error) {
    console.error('Error cargando inscripciones:', error)
  }
}

// Cargar inscripciones al montar el componente
onMounted(cargarInscripciones)
</script>
