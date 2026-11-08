import axios from 'axios'
import { getApiBaseUrl } from '../config/api'

const api = axios.create({
  baseURL: getApiBaseUrl() || 'https://portfolio-v1-2uu3.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Dynamically attach current API base URL on each request
api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl() || 'https://portfolio-v1-2uu3.onrender.com/api'
  return config;
})

export default api

