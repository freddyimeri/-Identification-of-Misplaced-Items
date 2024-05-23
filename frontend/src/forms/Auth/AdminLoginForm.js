// src/forms/Auth/AdminLoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import InputField from '../../components/Common/Form/InputField';
import ErrorMessage from '../../components/Common/Form/ErrorMessage';
import SubmitButton from '../../components/Common/Form/SubmitButton';

const AdminLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin-app/login/', { username, password });
            localStorage.setItem('adminToken', response.data.access);
            localStorage.setItem('isAdmin', true);
            localStorage.setItem('isAuthenticated', true);
            navigate('/admin/dashboard');
            window.location.reload(); // Refresh to update Navbar
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="auth-form">
            <h2 className="text-center">Admin Login</h2>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleSubmit}>
                <InputField
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <InputField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <SubmitButton label="Login" />
            </form>
        </div>
    );
};

export default AdminLoginForm;