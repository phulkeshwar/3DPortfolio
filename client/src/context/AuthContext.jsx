import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Set base URL for production
if (import.meta.env.VITE_API_URL) {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;
} else if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    axios.defaults.baseURL = 'https://myportfolio-server.vercel.app';
}

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post('/api/auth/login', { email, password }, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post('/api/auth/register', { name, email, password }, config);
            // Don't auto-login, just return success so UI can redirect to verify page
            return { success: true, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    };

    const verifyEmail = async (email, otp) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post('/api/auth/verify-email', { email, otp }, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    };

    const resendOTP = async (email) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post('/api/auth/resend-otp', { email }, config);
            return { success: true, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    };

    const forgotPassword = async (email) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post('/api/auth/forgot-password', { email }, config);
            return { success: true, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    };

    const resetPassword = async (email, otp, newPassword) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post('/api/auth/reset-password', { email, otp, newPassword }, config);
            return { success: true, message: data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyEmail, resendOTP, forgotPassword, resetPassword, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
