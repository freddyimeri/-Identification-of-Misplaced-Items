// src/services/auth.js
import api from './api';

export const login = async (credentials) => {
    const response = await api.post('/api/auth/login/', credentials);
    if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('isAuthenticated', true);
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/api/auth/register/', userData);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
};

export const getCurrentUser = async () => {
    const response = await api.get('/api/auth/user/');
    return response.data;
};
