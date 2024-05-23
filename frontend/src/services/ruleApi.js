import api, { getCsrfToken } from './api';

export const addRule = async (ruleData) => {
    const csrfToken = getCsrfToken();
    const response = await api.post('/api/rules/admin_manage_rule/', ruleData, {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
    return response.data;
};

export const getRules = async () => {
    const csrfToken = getCsrfToken();
    const response = await api.get('/api/rules/admin_manage_rule/', {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
    return response.data;
};

export const updateRule = async (ruleId, ruleData) => {
    const csrfToken = getCsrfToken();
    const response = await api.put(`/api/rules/admin_manage_rule/${ruleId}/`, ruleData, {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
    return response.data;
};

export const deleteRule = async (ruleId) => {
    const csrfToken = getCsrfToken();
    const response = await api.delete(`/api/rules/admin_manage_rule/${ruleId}/`, {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
    return response.data;
};
