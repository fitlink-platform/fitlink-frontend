import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { resetPassword } from "~/services/authService"; // tạo hàm này

// Schema xác thực
const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .required("Mật khẩu mới là bắt buộc"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
});

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async ({ password, confirmPassword }) => {
    try {
      await resetPassword(token, password, confirmPassword);
      toast.success("✅ Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "❌ Đặt lại mật khẩu thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🔒 Đặt lại mật khẩu</h2>
        <p className="text-gray-500 mb-6">Nhập mật khẩu mới cho tài khoản của bạn</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              {...register("password")}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.password && (
              <p className="text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              {...register("confirmPassword")}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
}
