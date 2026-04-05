import axios from 'axios';

const envApiBase = import.meta.env.VITE_API_BASE_URL;
const isBrowser = typeof window !== 'undefined';
const isLocalHost = isBrowser
  ? ['localhost', '127.0.0.1'].includes(window.location.hostname)
  : true;

const apiBase = envApiBase || (isLocalHost ? 'http://localhost:5000/api' : '/api');

if (!envApiBase && isBrowser && !isLocalHost) {
  console.warn('VITE_API_BASE_URL is missing. Configure it in your frontend deployment environment.');
}

const client = axios.create({
  baseURL: apiBase,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('lf_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;
