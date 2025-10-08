import React from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { sendForgotPasswordRequest } from '~/services/authService';
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
    <div className="min-h-screen w-full bg-[#0e2e2a]">
         <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
              <Link to="" className="text-xl md:text-2xl font-semibold tracking-wide text-white">
                F & Lower
              </Link>
              {/* <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
                <Link to="/shop" className="hover:text-white">Shop</Link>
                <Link to="/about" className="hover:text-white">About</Link>
                <Link to="/contact" className="hover:text-white">Contact</Link>
                <Link to="/faq" className="hover:text-white">FAQ</Link>
              </nav> */}
            </header>
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left / Hero block */}
          <div className="hidden md:flex flex-col justify-between rounded-2xl bg-[#143a35] p-8 shadow-2xl">
            <div>
              <p className="text-sm tracking-wider text-teal-200/80 mb-6">
                
              </p>
              <h2 className="text-white text-4xl md:text-5xl font-extrabold leading-tight">
                Forgot your<br />password?
              </h2>
              <p className="text-teal-100/90 mt-4 max-w-md">
                Nhập số điện thoại đã đăng ký. Chúng tôi sẽ gửi đường dẫn đặt lại mật khẩu tới email liên kết.
              </p>
            </div>

            <div className="mt-10">
              <img
                src="/forgot-password.png"
                alt="Forgot password illustration"
                className="w-full h-auto max-w-md rounded-xl opacity-95"
              />
            </div>
          </div>

          {/* Right / Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Quên mật khẩu
              </h1>
              <p className="text-gray-500 mt-1">
                Nhập số điện thoại để nhận link đặt lại mật khẩu qua email
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  placeholder="0xxxxxxxxx"
                  {...register('phone')}
                  className="w-full rounded-xl border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#0e2e2a] focus:border-transparent"
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#0e2e2a] hover:bg-[#0c2824] text-white font-semibold py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Gửi link đặt lại mật khẩu'}
              </button>

              <p className="text-sm text-center text-gray-600">
                Nhớ mật khẩu rồi?{' '}
                <Link to="/login" className="text-[#0e2e2a] font-medium hover:underline">
                  Quay lại đăng nhập
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
