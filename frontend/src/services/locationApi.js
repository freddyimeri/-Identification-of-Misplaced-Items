import api, { getCsrfToken } from './api';

export const addLocation = async (locationData) => {
    const csrfToken = getCsrfToken();
    const response = await api.post('/rules/admin_manage_location/', locationData, {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
    return response.data;
};

export const getLocations = async () => {
    const csrfToken = getCsrfToken();
    const response = await api.get('/rules/admin_manage_location/', {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
    return response.data;
};

export const updateLocation = async (locationId, locationData) => {
    const csrfToken = getCsrfToken();
    const response = await api.put(`/rules/admin_manage_location/${locationId}/`, locationData, {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
    return response.data;
};

export const deleteLocation = async (locationId) => {
    const csrfToken = getCsrfToken();
    const response = await api.delete(`/rules/admin_manage_location/${locationId}/`, {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
    return response.data;
};
