import React from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { sendForgotPasswordRequest } from '~/services/authService'; // bạn cần tạo hàm này
import { Link } from 'react-router-dom';

const schema = yup.object().shape({
  phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^0\d{9}$/, 'Số điện thoại không đúng định dạng'),
});

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async ({ phone }) => {
    try {
      await sendForgotPasswordRequest({ phone });
      toast.success('✅ Đã gửi link đặt lại mật khẩu đến email!');
    } catch (err) {
      toast.error(err?.response?.data?.message || '❌ Gửi yêu cầu thất bại!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 p-6 md:p-12 bg-white rounded-2xl shadow-xl">
        {/* Hình ảnh trái */}
        <div className="hidden md:flex items-center justify-center">
          <img src="/forgot-password.png" alt="Forgot password" className="w-full h-auto max-w-md" />
        </div>

        {/* Form bên phải */}
        <div className="flex flex-col justify-center px-4 md:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quên mật khẩu?</h2>
          <p className="text-gray-500 mb-6">Nhập số điện thoại để lấy lại mật khẩu qua email</p>

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                type="text"
                placeholder="Số điện thoại"
                {...register('phone')}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.phone && <p className="text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-3 disabled:opacity-50"
            >
              {isSubmitting ? "Đang xử lý..." : "Gửi link đặt lại mật khẩu"}
            </button>

            <p className="text-sm text-center text-gray-600 mt-6">
              Quay lại <Link to="/login" className="text-orange-500 hover:underline">Đăng nhập</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
