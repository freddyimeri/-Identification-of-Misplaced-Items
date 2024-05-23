// src/pages/Auth/LoginPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../forms/Auth/LoginForm';

const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = !!localStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="auth-container">
            <LoginForm />
        </div>
    );
};

export default LoginPage;
