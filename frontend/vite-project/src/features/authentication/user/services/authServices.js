import api from '../../../../lib/axios.js';

export const loginUser = async (credentials) => {
    // credentials already includes { email, password, guestId }
    const response = await api.post('/user/login', credentials);
    return response.data;
};

export const registerUser = async (data) => {
    // data includes { fullname, email, password, city, address, guestId }
    const response = await api.post('/user/register', data);
    return response.data;
};

export const logoutUser = async () => {
    return await api.post('/user/logout');
};