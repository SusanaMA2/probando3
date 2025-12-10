<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'
import { authStore } from '../services/auth.js' // ← Importar authStore

const usuarios = ref([])
const nuevo = ref({ nombre: '', correo: '', rol: 'user' })
const user = authStore.user // ← Usar authStore en vez de sessionStorage

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Correo', key: 'correo' },
  { title: 'Rol', key: 'rol' },
  { title: 'Estado', key: 'estado' },
  { title: 'Acciones', key: 'acciones' }
]

const cargarUsuarios = async () => {
  try {
    const res = await api.get('/users/')
    usuarios.value = res.data
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.error || 'Error al cargar usuarios')
  }
}

const crearUsuario = async () => {
  try {
    await api.post('/users/registrar', { 
      nombre: nuevo.value.nombre,
      correo: nuevo.value.correo,
      rol: nuevo.value.rol
    })
    nuevo.value = { nombre: '', correo: '', rol: 'user' }
    cargarUsuarios()
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.error || 'Error al crear usuario')
  }
}

const editarUsuario = async (id) => {
  const rol = prompt('Nuevo rol: admin o user')
  if (rol) {
    try {
      await api.put(`/users/${id}`, { rol })
      cargarUsuarios()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.error || 'Error al editar usuario')
    }
  }
}

const eliminarUsuario = async (id) => {
  if (confirm('¿Desactivar usuario?')) {
    try {
      await api.delete(`/users/${id}`)
      cargarUsuarios()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.error || 'Error al desactivar usuario')
    }
  }
}

onMounted(() => {
  if (user && user.rol === 'admin') {
    cargarUsuarios()
  } else {
    alert('No tienes permisos para acceder a esta página')
  }
})
</script>
