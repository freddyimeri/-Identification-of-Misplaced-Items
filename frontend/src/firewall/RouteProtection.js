// src/firewall/RouteProtection.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const RouteProtection = ({ redirectTo }) => {
    const isAuthenticated = !!localStorage.getItem('isAuthenticated');

    return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />;
};

export default RouteProtection;
