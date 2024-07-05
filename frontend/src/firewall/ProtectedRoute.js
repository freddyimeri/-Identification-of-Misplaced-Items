// src/firewall/ProtectedRoute.js

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../constants';

const ProtectedRoute = ({ children, isAdminRoute }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const auth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);

            if (!token) {
                console.log('No access token found, redirecting to login');
                setIsAuthorized(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const tokenExpiration = decoded.exp;
                const now = Math.floor(Date.now() / 1000);

                if (tokenExpiration < now) {
                    console.log('Access token expired, redirecting to login');
                    setIsAuthorized(false);
                } else {
                    if (isAdminRoute) {
                        const isAdmin = localStorage.getItem('isAdmin');
                        if (!isAdmin) {
                            console.log('Not an admin, redirecting to home');
                            setIsAuthorized(false);
                            return;
                        }
                    }
                    setIsAuthorized(true);
                }
            } catch (error) {
                console.log('Error decoding token:', error);
                setIsAuthorized(false);
            }
        };

        auth().catch(() => setIsAuthorized(false));
    }, [isAdminRoute]);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
