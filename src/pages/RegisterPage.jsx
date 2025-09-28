import React from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerByPhone } from '~/services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải từ 2 ký tự'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^0\d{9}$/, 'Số điện thoại không đúng định dạng'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu ít nhất 6 ký tự'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc')
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const navigate = useNavigate();

  const onSubmit = async ({ name, phone, password, email }) => {
    try {
      await registerByPhone(name, phone, password, email);
      toast.success('Tạo tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 p-6 md:p-12 bg-white rounded-2xl shadow-xl">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center">
          <img src="/dog.png" alt="Register illustration" className="w-full h-auto max-w-md" />
        </div>

        {/* Right Register Form */}
        <div className="flex flex-col justify-center px-4 md:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký</h2>
          <p className="text-gray-500 mb-6">Tạo tài khoản mới để bắt đầu</p>

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                type="text"
                placeholder="Tên"
                {...register('name')}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <input
                type="text"
                placeholder="Email"
                {...register('email')}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
            </div>
 <span>.</span>
            <div>
              <input
                type="text"
                placeholder="Số điện thoại đăng nhập"
                {...register('phone')}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.phone && <p className="text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Mật khẩu"
                {...register('password')}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                {...register('confirmPassword')}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.confirmPassword && <p className="text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-3 disabled:opacity-50"
            >
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </button>

            <p className="text-sm text-center text-gray-600 mt-6">
              Đã có tài khoản? <Link to={'/login'} className="text-orange-500 hover:underline">Đăng nhập</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
