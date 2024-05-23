// frontend/src/services/auth.js
import api from './api';

export const login = async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.access) {
        localStorage.setItem('token', response.data.access);
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/user/');
    return response.data;
};
