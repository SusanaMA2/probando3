<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api.js'
import { authStore } from '../services/auth.js'

// Reactivos
const imagenes = ref([])
const nuevo = ref({ titulo: '', url: '', descripcion: '' })

// Computed para que se actualice automáticamente cuando cambie la sesión
const user = computed(() => authStore.user)

const cargarImagenes = async () => {
  try {
    const res = await api.get('/images/')
    imagenes.value = res.data
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.error || 'Error al cargar imágenes')
  }
}

const crearImagen = async () => {
  if (!nuevo.value.titulo || !nuevo.value.url) return alert('Título y URL obligatorios')
  try {
    await api.post('/images/', { ...nuevo.value })
    nuevo.value = { titulo: '', url: '', descripcion: '' }
    cargarImagenes()
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.error || 'Error al crear imagen')
  }
}

const editarImagen = async (id) => {
  const titulo = prompt('Nuevo título')
  if (titulo) {
    try {
      await api.put(`/images/${id}`, { titulo })
      cargarImagenes()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.error || 'Error al editar imagen')
    }
  }
}

const eliminarImagen = async (id) => {
  if (confirm('¿Eliminar imagen?')) {
    try {
      await api.delete(`/images/${id}`)
      cargarImagenes()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.error || 'Error al eliminar imagen')
    }
  }
}

onMounted(() => {
  if (!user.value) alert('Inicia sesión para ver imágenes')
  cargarImagenes()
})
</script>
