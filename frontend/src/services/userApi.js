// frontend/src/services/userApi.js
import api from './api';

export const getUsers = async () => {
    const response = await api.get('/rules/users/');
    return response.data;
};
