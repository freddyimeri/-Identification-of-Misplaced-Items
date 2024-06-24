// src/services/userApi.js

import api from './api';

export const getUsers = async () => {
    const response = await api.get('/api/rules/users/');
    return response.data;
};

export const updateUserEmail = async (emailData) => {
    const response = await api.put('/api/user_dashboard/update_email/', emailData);
    return response.data;
};

export const updateUsername = async (usernameData) => {
    const response = await api.put('/api/user_dashboard/update_username/', usernameData);
    return response.data;
};

export const getCurrentUserEmail = async () => {
    const response = await api.get('/api/user_dashboard/email/');
    return response.data;
};

export const getCurrentUserUsername = async () => {
    const response = await api.get('/api/user_dashboard/username/');
    return response.data;
};

export const updatePassword = async (passwordData) => {
    const response = await api.put('/api/user_dashboard/update_password/', passwordData);
    return response.data;
};
