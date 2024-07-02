// src/services/api.js
import axios from 'axios';
import { refreshToken } from './auth';

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
    baseURL: 'http://localhost:8080',  // Ensure this URL is correct
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
                try {
                    const newTokens = await refreshToken();
                    if (newTokens) {
                        token = newTokens.access;
                        localStorage.setItem('token', newTokens.access);
                        localStorage.setItem('tokenExpiry', newTokens.accessExpiry);
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refresh');
                        localStorage.removeItem('tokenExpiry');
                        window.location.href = '/login';
                        return Promise.reject('Session expired. Please log in again.');
                    }
                } catch (err) {
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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('API error:', error);  // Debugging
        if (error.response && error.response.status === 500) {
            window.location.href = '/error-500';
        } else if (error.request && !error.response) {
            console.log('Network or server error');  // Debugging
            window.location.href = '/error-500';
        }
        return Promise.reject(error);
    }
);

export default api;
