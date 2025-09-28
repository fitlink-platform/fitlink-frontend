import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// import { getToken } from '~/auth/token';

// const axiosClient = axios.create({
//   baseURL: 'http://localhost:3000',
// });

// axiosClient.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true // 💡 Phải có dòng này để gửi cookie
});

// Interceptor xử lý lỗi tập trung
let isRedirected = false;

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || "Lỗi hệ thống. Vui lòng thử lại.";

    toast.error(`🔥 ${message}`);

    if ((status === 401 || status === 403) && !isRedirected) {
      isRedirected = true; // ⚠️ Đánh dấu đã redirect rồi
    
    }

    return Promise.reject(error);
  }
);




export default axiosClient;
