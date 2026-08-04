import axios from 'axios';

export const getApiUrl = (path = '') => {
    if (import.meta.env.VITE_API_URL) {
        return `${import.meta.env.VITE_API_URL}${path}`;
    }
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
        return `https://portfolio-backend-980z.onrender.com${path}`;
    }
    return path;
};

const apiClient = axios.create({
    baseURL: getApiUrl(''),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor to attach bearer token if present
apiClient.interceptors.request.use((config) => {
    try {
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.token) {
                config.headers.Authorization = `Bearer ${parsed.token}`;
            }
        }
    } catch (e) {
        console.error('Failed to parse admin token from storage', e);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
