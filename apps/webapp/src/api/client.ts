import axios from 'axios'
import { supabase } from '../lib/supabase'

// Use VITE_API_URL in production, fall back to /api for local dev (Vite proxy)
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add user ID to all requests
api.interceptors.request.use(
  async (config) => {
    // Get current user from Supabase
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Add user ID to request headers
      config.headers['X-User-ID'] = user.id
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message
    console.error('API Error:', message)
    return Promise.reject(error)
  }
)

export default api
