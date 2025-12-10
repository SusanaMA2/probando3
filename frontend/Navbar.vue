<template>
  <v-app-bar color="primary" dark>
    <v-toolbar-title>Mi Sistema</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text to="/">Home</v-btn>
    <v-btn text to="/eventos">Eventos</v-btn>
    <v-btn text to="/noticias">Noticias</v-btn>
    <v-btn text to="/imagenes" v-if="user?.rol==='admin'">Imagenes</v-btn>
    <v-btn text to="/videos" v-if="user?.rol==='admin'">Videos</v-btn>
    <v-btn text to="/mis-inscripciones" v-if="user">Mis Inscripciones</v-btn>
    <v-btn text @click="logout" v-if="user">Logout</v-btn>
    <v-btn text to="/login" v-else>Login</v-btn>
  </v-app-bar>
</template>

<script setup>
import { authStore } from '../services/auth.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = authStore.user

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>
