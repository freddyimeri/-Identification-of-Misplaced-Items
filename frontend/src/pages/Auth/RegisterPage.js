// src/pages/Auth/RegisterPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../forms/Auth/RegisterForm';
import '../../styles/main.css';

const RegisterPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = !!localStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="pages-container-center">
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;
