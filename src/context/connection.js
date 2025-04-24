import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // Cambia esta URL por la de tu API REST
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;