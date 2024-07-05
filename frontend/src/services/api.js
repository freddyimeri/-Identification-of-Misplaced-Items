// src/services/api.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { logout } from './auth'; // Importing the consolidated logout

const getCsrfToken = () => {
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
    withCredentials: true,
});

let isRefreshing = false;

const setRefreshTimer = (expiryTime) => {
    const now = Math.floor(Date.now() / 1000);
    const timeToRefresh = (expiryTime - now - 60) * 1000; // Set timer to 1 minute before expiry
    setTimeout(() => {
        if (!isRefreshing) {
            refreshToken();
        }
    }, timeToRefresh);
};

const refreshToken = async () => {
    if (isRefreshing) {
        return; // If a refresh is already in progress, don't start another one
    }
    isRefreshing = true;
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    if (refresh) {
        try {
            console.log('Attempting to refresh token with refresh token:', refresh);
            const response = await api.post('/api/auth/token/refresh/', { refresh });
            const { access, refresh: newRefreshToken } = response.data;

            console.log('Access Token:', access);
            localStorage.setItem(ACCESS_TOKEN, access);

            // If a new refresh token is provided, save it
            if (newRefreshToken) {
                console.log('New Refresh Token:', newRefreshToken);
                localStorage.setItem(REFRESH_TOKEN, newRefreshToken);
            }

            setRefreshTimer(jwtDecode(access).exp); // Set the timer after refreshing the token
        } catch (error) {
            console.log('Token refresh error:', error);
            logout();
        } finally {
            isRefreshing = false;
        }
    } else {
        logout();
        isRefreshing = false;
    }
};

const initializeTokenRefresh = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const refresh = localStorage.getItem(REFRESH_TOKEN);

    if (token) {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Math.floor(Date.now() / 1000);

        if (tokenExpiration > now) {
            setRefreshTimer(tokenExpiration);
        } else if (refresh) {
            refreshToken(); // Token expired, but refresh token exists
        }
    } else if (refresh) {
        refreshToken(); // No access token, but refresh token exists
    }
};

const obtainToken = async (url, credentials) => {
    try {
        const response = await api.post(url, credentials);
        const { access, refresh } = response.data;

        console.log('Access Token:', access);
        localStorage.setItem(ACCESS_TOKEN, access);
        localStorage.setItem(REFRESH_TOKEN, refresh);

        setRefreshTimer(jwtDecode(access).exp); // Set the timer after obtaining the token

        return response.data;
    } catch (error) {
        console.log('Token obtain error:', error);
        throw error;
    }
};

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log('No access token found for the request');
        }

        const csrfToken = getCsrfToken();
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        return config;
    },
    (error) => {
        console.log('Request error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('API error:', error);
        if (error.response && error.response.status === 500) {
            window.location.href = '/error-500';
        } else if (error.request && !error.response) {
            console.log('Network or server error');
            window.location.href = '/error-500';
        }
        return Promise.reject(error);
    }
);

export { getCsrfToken, setRefreshTimer, initializeTokenRefresh, refreshToken, obtainToken };
export default api;
