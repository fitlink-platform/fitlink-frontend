// pages/RegisterPage.jsx
import React from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerStart } from '~/services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  name: yup.string().required('Tên là bắt buộc').min(2, 'Tên phải từ 2 ký tự'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  phone: yup.string().required('Số điện thoại là bắt buộc').matches(/^0\d{9}$/, 'Số điện thoại không đúng định dạng'),
  password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu ít nhất 6 ký tự'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp').required('Xác nhận mật khẩu là bắt buộc')
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();

  // UI state cho flow "đã gửi email + countdown 3’ + resend"
  const [emailSent, setEmailSent] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(180); // 3 phút
  const [resendCooldown, setResendCooldown] = React.useState(0); // ví dụ 60s

  // countdown 3 phút
  React.useEffect(() => {
    if (!emailSent) return;
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [emailSent, secondsLeft]);

  // cooldown gửi lại
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const onSubmit = async ({ name, phone, password, email }) => {
    try {
      await registerStart({ name, phone, password, email });
      setEmailSent(true);
      setSecondsLeft(180);
      setResendCooldown(60);
      toast.success('Đã gửi email xác nhận. Vui lòng kiểm tra hộp thư trong 3 phút.');
      // (Tuỳ chọn) chuyển sang một trang thông báo riêng:
      // navigate('/verify-email-sent', { state: { email } });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      const { name, phone, password, email } = getValues();
      await registerStart({ name, phone, password, email }); // gọi lại start để tạo token mới
      setSecondsLeft(180);
      setResendCooldown(60);
      toast.success('Đã gửi lại email xác nhận');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gửi lại email thất bại');
    }
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${ss.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#0e2e2a]">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="" className="text-xl md:text-2xl font-semibold tracking-wide text-white">
          F & Lower
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left / Hero */}
          <div className="hidden md:flex flex-col justify-between rounded-2xl bg-[#143a35] p-8 shadow-2xl">
            <div>
              <p className="text-sm tracking-wider text-teal-200/80 mb-6"></p>
              <h2 className="text-white text-4xl md:text-5xl font-extrabold leading-tight">
                A bouquet for every<br />occasion.
              </h2>
              <p className="text-teal-100/90 mt-4 max-w-md">
                Select a bouquet, add a personalized card, and we’ll deliver it right on time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => (window.location.href = '/shop')}
              className="mt-10 inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 text-white px-5 py-3 transition-colors"
            >
              Shop all flowers
            </button>
          </div>

          {/* Right / Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Create account
              </h1>
              <p className="text-gray-500 mt-1">Nhập thông tin để tạo tài khoản mới</p>
            </div>

            {!emailSent ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên"
                    {...register('name')}
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#0e2e2a] focus:border-transparent"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="text"
                    placeholder="you@example.com"
                    {...register('email')}
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#0e2e2a] focus:border-transparent"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại đăng nhập</label>
                  <input
                    type="text"
                    placeholder="0xxxxxxxxx"
                    {...register('phone')}
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#0e2e2a] focus:border-transparent"
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#0e2e2a] focus:border-transparent"
                  />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    {...register('confirmPassword')}
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#0e2e2a] focus:border-transparent"
                  />
                  {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#0e2e2a] hover:bg-[#0c2824] text-white font-semibold py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi email xác nhận'}
                </button>

                <p className="text-sm text-center text-gray-600">
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="text-[#0e2e2a] font-medium hover:underline">
                    Đăng nhập
                  </Link>
                </p>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                  <p className="text-green-800 font-medium">
                    Đã gửi email xác nhận. Vui lòng kiểm tra hộp thư trong <b>3 phút</b>.
                  </p>
                  <p className="text-green-700 mt-1">Link xác nhận sẽ hết hạn sau: <b>{fmt(secondsLeft)}</b></p>
                </div>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="w-full rounded-xl bg-[#0e2e2a] hover:bg-[#0c2824] text-white font-semibold py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : 'Gửi lại email xác nhận'}
                </button>

                <p className="text-sm text-center text-gray-600">
                  Sau khi nhấn link trong email, bạn có thể{' '}
                  <Link to="/login" className="text-[#0e2e2a] font-medium hover:underline">
                    đăng nhập
                  </Link>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
