// src/pages/Admin/AdminLoginPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginForm from '../../forms/Auth/AdminLoginForm';
import '../../styles/main.css';

const AdminLoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = !!localStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    return (
        <div className="pages-container-center">
            <AdminLoginForm />
        </div>
    );
};

export default AdminLoginPage;
