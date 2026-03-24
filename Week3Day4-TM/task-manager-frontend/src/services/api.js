import axios from 'axios';

const api = axios.create({
  // Add '/api' here so all requests automatically go to http://localhost:5000/api/...
  baseURL: 'http://localhost:5000/api', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;