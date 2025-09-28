import axios from '../api/axiosClient';
import { setToken, removeToken } from '../auth/token';

export const login = async (phone, password) => {
    try {
        const res = await axios.post('/auth/login', { phone, password });
        setToken(res.data.accessToken);
        return res.data;
    } catch (error) {
        console.error('Login failed:', error); // xử lý lỗi cụ thể
        throw error;
    }

};

export const registerByPhone = async (name, phone, password, email) => {
    try {
        const res = await axios.post('/auth/register', { phone, password, name, email });
        setToken(res.data.accessToken);
        return res.data;
    } catch (error) {
        console.error('Register failed:', error); // xử lý lỗi cụ thể
        throw error;
    }
}

export const logout = async () => {
    try {
        await axios.post('/auth/logout')
    } catch (error) {
        console.error('Logout failed:', error); // xử lý lỗi cụ thể
        throw error;
    }
}

export const sendForgotPasswordRequest = async ({ phone }) => {
  return await axios.post('/auth/forgot-password', { phone });
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  const res = await axios.post(`/auth/reset-password/${token}`, { password: newPassword, confirmPassword });
  return res.data;
};


