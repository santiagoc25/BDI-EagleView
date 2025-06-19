// src/services/api.js - VERSIÓN MAESTRA FINAL
import axios from 'axios';

const API_URL =  import.meta.env.VITE_API_URL; 

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para añadir el token a TODAS las peticiones
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));


// <<< LA CLAVE ESTÁ AQUÍ: `export const api` >>>
// Esto crea una exportación nombrada llamada 'api'.
export const api = {
  // --- Autenticación ---
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  
  // --- Contenido y Filtros ---
  getContent: (filters = {}) => {
    const cleanFilters = {};
    for (const key in filters) {
      if (filters[key]) cleanFilters[key] = filters[key];
    }
    return apiClient.get('/content', { params: cleanFilters });
  },
  getContentById: (id) => apiClient.get(`/content/${id}`),
  getGenres: () => apiClient.get('/genres'),
  getTypes: () => apiClient.get('/types'),
  
  // --- Calificaciones ---
  getRatingsByContentId: (contentId) => apiClient.get(`/content/${contentId}/ratings`),
  postRating: (contentId, ratingData) => apiClient.post(`/content/${contentId}/ratings`, ratingData),
  deleteRating: (contentId, ratingId) => apiClient.delete(`/content/${contentId}/ratings/${ratingId}`),

  // --- Perfil de Usuario ---
  getProfile: () => apiClient.get('/users/me'),
  updateProfile: (profileData) => apiClient.put('/users/me', profileData),
    deleteProfile: (password) => apiClient.delete('/users/me', { data: { password } }),

  // --- Favoritos ---
  getFavorites: () => apiClient.get('/users/me/favorites'),
  toggleFavorite: (contentId) => apiClient.post('/users/me/favorites', { contentId }), 
  removeFavorite: (contentId) => apiClient.delete(`/users/me/favorites/${contentId}`),
  
  // --- Métodos para el Panel de Administrador ---
  getAllUsers: () => apiClient.get('/users'),
  createContent: (contentData) => apiClient.post('/content', contentData),
  updateContent: (id, contentData) => apiClient.put(`/content/${id}`, contentData),
  deleteContent: (id) => apiClient.delete(`/content/${id}`),
};