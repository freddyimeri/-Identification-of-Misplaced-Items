// src/services/api.js
import axios from 'axios';
import { refreshToken } from './auth';  // Import the refresh token function

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
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        if (token) {
            const tokenExpiry = localStorage.getItem('tokenExpiry');
            const now = Math.floor(Date.now() / 1000);
            if (tokenExpiry && now >= tokenExpiry) {
                // Token expired, refresh it
                const newTokens = await refreshToken();
                if (newTokens) {
                    token = newTokens.access;
                } else {
                    // Refresh token also expired or failed, logout user
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('tokenExpiry');
                    window.location.href = '/login';
                    return Promise.reject('Session expired. Please log in again.');
                }
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
