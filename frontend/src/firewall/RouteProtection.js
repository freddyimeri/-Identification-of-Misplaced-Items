// src/firewall/RouteProtection.js

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../constants';

const RouteProtection = ({ redirectTo }) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    let isAuthenticated = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;
            isAuthenticated = tokenExpiration > now;
        } catch (error) {
            console.error("Invalid token");
        }
    }

    return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />;
};

export default RouteProtection;
