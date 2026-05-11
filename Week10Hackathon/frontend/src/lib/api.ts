import axios from 'axios';

const api = axios.create({
  baseURL: 'https://assignmentbackend-eight.vercel.app',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token'); //[cite: 2]
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;