// src/services/api.js
import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://ecommerce-website-ten-henna.vercel.app/api",
});

// Optionally, add auth token if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;