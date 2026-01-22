import axios from 'axios'
import { supabase } from '../lib/supabase'

const api = axios.create({
  baseURL: '/api',
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
