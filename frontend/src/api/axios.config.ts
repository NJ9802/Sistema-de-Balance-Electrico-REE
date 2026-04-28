import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Error de conexión con el servidor';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;