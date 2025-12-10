<template>
  <v-container class="d-flex justify-center">
    <v-btn color="primary" @click="loginGoogle">Iniciar sesión con Google</v-btn>
  </v-container>
</template>

<script setup>
// axios
axios.get("http://localhost:5000/api/users/google/login", {
  withCredentials: true  // 🔹 obligatorio para enviar la cookie
});

</script>
