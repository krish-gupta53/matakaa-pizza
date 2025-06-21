import React, { useState, useEffect } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        
        if (token && userRole) {
            if (userRole === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const endpoint = isLogin ? '/api/user/login' : '/api/user/register';
            const response = await axios.post(endpoint, formData);

            if (response.data.success) {
                // Store auth data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('userName', response.data.name);

                // Set default axios header
                axios.defaults.headers.common['token'] = response.data.token;

                toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
                
                // Redirect based on role
                if (response.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            } else {
                toast.error(response.data.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Login/Register error:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-content">
                <div className="auth-header">
                    <h1>Welcome to Matakaa-pizza</h1>
                    <p>Your favorite food delivery platform</p>
                </div>
                
                <div className="auth-box">
                    <div className="auth-tabs">
                        <button 
                            className={`tab ${isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(true)}
                            disabled={isLoading}
                        >
                            Login
                        </button>
                        <button 
                            className={`tab ${!isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(false)}
                            disabled={isLoading}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login; 