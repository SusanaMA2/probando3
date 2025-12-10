<template>
  <v-app>
    <Navbar :usuario="authStore.user" @logout="logout" />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { authStore } from './services/auth.js'

const logout = () => {
  authStore.logout()
  window.location.href = '/login'
}
</script>
