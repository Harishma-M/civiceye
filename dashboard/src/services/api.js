import axios from 'axios';

// When accessed from phone browser, window.location.hostname is the laptop IP.
// When on localhost (laptop browser), use the Vite proxy at /api/v1.
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
  baseURL: isLocalhost
    ? '/api/v1'
    : `http://${window.location.hostname}:8000/api/v1`,  // Uses same IP the phone used to load the page
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
