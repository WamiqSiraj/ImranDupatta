import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:2000/api/v1', // Updated to match backend port
    withCredentials: true, // Crucial for cookies
});

export default api;