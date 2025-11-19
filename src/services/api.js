import axios from 'axios';
import store from '@/store';
import router from '@/router';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = store.state.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      store.commit('clearAuth');
      router.push('/login');
    }
    return Promise.reject(err);
  }
);

export default api;
