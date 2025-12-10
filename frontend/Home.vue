<template>
  <v-container>
    <h1>Depuración de sesión</h1>
    <p v-if="!user">No hay usuario logueado</p>
    <p v-else>
      Usuario: {{ user.nombre }} <br>
      Correo: {{ user.correo }} <br>
      Rol: {{ user.rol }}
    </p>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { authStore } from '../services/auth.js'

const user = ref(null)

onMounted(async () => {
  // Intentar traer usuario desde authStore
  if (!authStore.user) {
    await authStore.fetchUser() // Esto hará la llamada a Flask
  }
  user.value = authStore.user
})
</script>

