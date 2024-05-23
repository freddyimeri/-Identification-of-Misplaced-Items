// src/firewall/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminRoute }) => {
    const isAuthenticated = !!localStorage.getItem('isAuthenticated');
    const isAdmin = !!localStorage.getItem('isAdmin');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (isAdminRoute && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
