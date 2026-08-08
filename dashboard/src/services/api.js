import axios from 'axios';
import { Capacitor } from '@capacitor/core';

// Detect if running natively on a mobile device (Android/iOS)
const isNative = Capacitor.isNativePlatform();

// When accessed from phone browser, window.location.hostname is the laptop IP.
// When on localhost (laptop browser), use the Vite proxy at /api/v1.
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
  baseURL: isNative
    ? 'http://10.217.6.81:8000/api/v1' // Hardcoded laptop IP for native app
    : isLocalhost
      ? '/api/v1' // Proxy for laptop browser
      : `http://${window.location.hostname}:8000/api/v1`, // Phone browser
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
