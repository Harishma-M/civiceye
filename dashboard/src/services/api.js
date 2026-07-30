import axios from 'axios';

// Detect if running inside native app (Capacitor)
const isNative = window.location.origin.includes('capacitor://') || window.location.origin.includes('http://localhost:80');

const api = axios.create({
  baseURL: isNative 
    ? 'https://643b75c36186d5.lhr.life/api/v1' // Points to the active public tunnel
    : '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
