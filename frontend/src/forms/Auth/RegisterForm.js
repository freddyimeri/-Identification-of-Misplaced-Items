// src/forms/Auth/RegisterForm.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import InputField from '../../components/Common/Form/InputField';
import ErrorMessage from '../../components/Common/Form/ErrorMessage';
import SubmitButton from '../../components/Common/Form/SubmitButton';
import PasswordInputField from '../../components/Common/Password/PasswordInputField';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    const validatePassword = useCallback(() => {
        const requirements = {
            length: /.{8,}/,
            uppercase: /[A-Z]/,
            lowercase: /[a-z]/,
            number: /[0-9]/,
        };

        const value = password;
        let allValid = true;

        for (const key in requirements) {
            if (!requirements[key].test(value)) {
                allValid = false;
                break;
            }
        }

        return allValid;
    }, [password]);

    const checkPasswordMatch = useCallback(() => {
        if (validatePassword()) {
            if (password2 === '') {
                setPasswordMatchMessage('');
                return false;
            }
            if (password === password2) {
                setPasswordMatchMessage('Passwords match');
                return true;
            } else {
                setPasswordMatchMessage('Passwords do not match');
                return false;
            }
        } else {
            setPasswordMatchMessage('');
            return false;
        }
    }, [password, password2, validatePassword]);

    const validateForm = useCallback(() => {
        const isUsernameFilled = username.trim() !== '';
        const isEmailFilled = email.trim() !== '';
        const isPassword1Valid = validatePassword();
        const isPasswordMatch = checkPasswordMatch();

        setIsFormValid(isUsernameFilled && isEmailFilled && isPassword1Valid && isPasswordMatch);
    }, [username, email, validatePassword, checkPasswordMatch]);

    useEffect(() => {
        validateForm();
    }, [username, email, password, password2, validateForm]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setError("Passwords do not match");
            return;
        }
        try {
            const response = await api.post('/auth/register/', { username, email, password, password2 });
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('isAuthenticated', true);
            navigate('/');
            window.location.reload(); // Refresh to update Navbar
        } catch (error) {
            setError('Registration failed');
        }
    };

    return (
        <div className="auth-form">
            <h2 className="text-center">Register</h2>
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
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <PasswordInputField
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showRequirements={true}
                />
                <PasswordInputField
                    label="Confirm Password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                />
                <small id="passwordMatchMessage" className={`form-text ${passwordMatchMessage.includes('match') ? 'text-success' : 'text-danger'}`}>
                    {passwordMatchMessage}
                </small>
                <SubmitButton label="Register" disabled={!isFormValid} />
            </form>
        </div>
    );
};

export default RegisterForm;
