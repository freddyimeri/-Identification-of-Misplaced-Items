// src/services/itemApi.js
import api, { getCsrfToken } from './api';

export const addItem = async (itemData) => {
    const csrfToken = getCsrfToken();
    const response = await api.post('/rules/admin_manage_item/', itemData, {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
    return response.data;
};

export const getItems = async () => {
    const csrfToken = getCsrfToken();
    const response = await api.get('/rules/admin_manage_item/', {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
    return response.data;
};

export const updateItem = async (itemId, itemData) => {
    const csrfToken = getCsrfToken();
    const response = await api.put(`/rules/admin_manage_item/${itemId}/`, itemData, {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
    return response.data;
};

export const deleteItem = async (itemId) => {
    const csrfToken = getCsrfToken();
    const response = await api.delete(`/rules/admin_manage_item/${itemId}/`, {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
    return response.data;
};
