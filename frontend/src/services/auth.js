// src/services/auth.js

import api, { obtainToken, setRefreshTimer } from './api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { jwtDecode } from 'jwt-decode';

// Login function for regular users
export const login = async (credentials) => {
    const data = await obtainToken('/api/auth/login/', credentials);
    localStorage.setItem('isAuthenticated', true);
    return data;
};

// Register function for new users
export const register = async (userData) => {
    try {
        const data = await obtainToken('/api/auth/register/', userData);
        localStorage.setItem('isAuthenticated', true);
        return data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code outside of the range of 2xx
            console.error('Registration failed:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an error
            console.error('Error in registration request setup:', error.message);
        }
        throw error;
    }
};


// Admin login function
export const adminLogin = async (credentials) => {
    const data = await obtainToken('/api/auth/admin/login/', credentials);
    localStorage.setItem('isAdmin', true);
    localStorage.setItem('username', credentials.username);
    localStorage.setItem('isAuthenticated', true);
    return data;
};


// Logout function
export const logout = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
        console.log('Attempting to logout with refresh token:', refreshToken);
        await api.post('/api/auth/logout/', { refresh_token: refreshToken });
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        console.log('Clearing local storage');
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('username');
    }
};

// Function to get the current user
export const getCurrentUser = async () => {
    try {
        console.log('Fetching current user');
        const response = await api.get('/api/auth/user/');
        return response.data;
    } catch (error) {
        console.log('Get current user error:', error);
        throw error;
    }
};

// Function to refresh the token manually if needed
export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }
        const response = await api.post('/api/auth/token/refresh/', { refresh: refreshToken });
        const { access, refresh: newRefreshToken } = response.data;

        console.log('Access Token:', access);
        localStorage.setItem(ACCESS_TOKEN, access);

        if (newRefreshToken) {
            console.log('New Refresh Token:', newRefreshToken);
            localStorage.setItem(REFRESH_TOKEN, newRefreshToken);
        }

        setRefreshTimer(jwtDecode(access).exp); // Set the timer after refreshing the token

        return response.data;
    } catch (error) {
        console.log('Token refresh error:', error);
        throw error;
    }
};
