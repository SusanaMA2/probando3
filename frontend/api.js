import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

apiClient.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === 403) alert('No tienes permisos')
    return Promise.reject(err)
  }
)

export default apiClient
