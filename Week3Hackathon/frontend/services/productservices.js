// src/services/ProductService.js
import axios from 'axios';

const API_URL = 'https://ecommerce-website-ten-henna.vercel.app';

export const getProducts = () => axios.get(API_URL);

export const addProduct = (productData, token) => {
  return axios.post(`${API_URL}/add`, productData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};