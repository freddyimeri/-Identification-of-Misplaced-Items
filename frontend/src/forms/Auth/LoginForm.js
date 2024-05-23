// src/forms/Auth/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import InputField from '../../components/Common/Form/InputField';
import ErrorMessage from '../../components/Common/Form/ErrorMessage';
import SubmitButton from '../../components/Common/Form/SubmitButton';
import PasswordInputField from '../../components/Common/Password/PasswordInputField';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login/', { username, password });
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('isAuthenticated', true); // Set the authentication flag
            navigate('/');
            window.location.reload(); // Refresh to update Navbar
        } catch (error) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="auth-form">
            <h2 className="text-center">Login</h2>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleSubmit}>
                <InputField
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <PasswordInputField
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <SubmitButton label="Login" />
            </form>
        </div>
    );
};

export default LoginForm;
