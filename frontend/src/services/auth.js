// src/services/auth.js
import api from './api';

export const login = async (credentials) => {
    const response = await api.post('/api/auth/login/', credentials);
    if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        const tokenPayload = JSON.parse(atob(response.data.access.split('.')[1]));
        localStorage.setItem('tokenExpiry', tokenPayload.exp);
        localStorage.setItem('isAuthenticated', true);
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/api/auth/register/', userData);
    if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        const tokenPayload = JSON.parse(atob(response.data.access.split('.')[1]));
        localStorage.setItem('tokenExpiry', tokenPayload.exp);
        localStorage.setItem('isAuthenticated', true);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('isAuthenticated');
};

export const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
        try {
            const response = await api.post('/api/auth/token/refresh/', { refresh });
            localStorage.setItem('token', response.data.access);
            const tokenPayload = JSON.parse(atob(response.data.access.split('.')[1]));
            localStorage.setItem('tokenExpiry', tokenPayload.exp);
            return response.data;
        } catch (error) {
            logout();
        }
    }
    return null;
};

export const getCurrentUser = async () => {
    const response = await api.get('/api/auth/user/');
    return response.data;
};


export const adminLogin = async (credentials) => {
    const response = await api.post('/api/auth/admin/login/', credentials);
    if (response.data.access) {
        localStorage.setItem('adminToken', response.data.access);
        localStorage.setItem('isAdmin', true);
        localStorage.setItem('username', credentials.username);
        localStorage.setItem('isAuthenticated', true);
    }
    return response.data;
}

