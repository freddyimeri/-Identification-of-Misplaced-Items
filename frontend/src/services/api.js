// src/services/api.js
import axios from 'axios';

export const getCsrfToken = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name.trim() === 'csrftoken') {
            return value;
        }
    }
    return null;
};

const api = axios.create({
    baseURL: 'http://localhost:8080', // Update this to match your Django backend address
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        const csrfToken = getCsrfToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default api;
