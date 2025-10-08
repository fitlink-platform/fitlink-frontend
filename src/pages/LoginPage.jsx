import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login } from "~/services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "~/contexts/AuthProvider";
import { getProfile } from "~/services/userService";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "~/services/authService";

const schema = yup.object().shape({
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^0\d{9}$/, "Số điện thoại không đúng định dạng"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu ít nhất 6 ký tự"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onSubmit = async ({ phone, password }) => {
    try {
      const data = await login(phone, password);
      const profile = await getProfile();
      setUser(profile);
      toast.success("Đăng nhập thành công!");

      switch (profile.role) {
        case "admin":
          navigate("/admin")
          break;

        case "pt":
          navigate("/pt")
          break;
        case "student":
          navigate("/")
          break;

        default:
          break;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const data = await loginWithGoogle(idToken);

      setUser(data.user); // user lấy từ backend
      toast.success("Đăng nhập Google thành công!");

      switch (data.user.role) {
        case "admin":
          navigate("/admin")
          break;

        case "pt":
          navigate("/pt")
          break;
        case "student":
          navigate("/")
          break;

        default:
          break;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Đăng nhập Google thất bại");
    }
  };


  const handleError = () => {
    toast.error("Login Failed")

  }

  return (
    <div className="min-h-screen bg-[#0f2a27] text-white">
      {/* Top bar (logo / nav placeholder) */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="" className="text-xl md:text-2xl font-semibold tracking-wide">
          F & Lower
        </Link>
        {/* <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <Link to="/shop" className="hover:text-white">Shop</Link>
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
          <Link to="/faq" className="hover:text-white">FAQ</Link>
        </nav> */}
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          {/* Left visual panel (hero-like) */}
          <div className="relative bg-[#152f2b] hidden md:block">
            <img
              src="/as/flowers-hero.jpg" // đổi thành ảnh hoa của bạn
              alt="Bouquet"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            <div className="relative h-full w-full p-10 flex flex-col justify-end">
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                A bouquet for every occasion.
              </h1>
              <p className="mt-4 text-white/80 max-w-md">
                Select a bouquet, add a personalized card, and we’ll deliver it
                right on time.
              </p>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-white/90 text-[#0f2a27] px-5 py-3 font-medium hover:bg-white"
              >
                Shop all flowers
              </Link>
            </div>
          </div>

          {/* Right form panel */}
          <div className="bg-white text-[#0f2a27] p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-semibold">Sign in</h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back. Please enter your details.
            </p>

            <form
              className="mt-8 flex flex-col space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone number
                </label>
                <input
                  type="text"
                  placeholder="0xxxxxxxxx"
                  {...register("phone")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••"
                  {...register("password")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-gray-700">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-emerald-700 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-[#0f2a27] text-white py-3 font-medium hover:bg-[#153b36] disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-gray-400 text-xs">or</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* <button
                type="button"
                onClick={() => console.log("TODO: Google login")}
                className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button> */}

              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
              />

              <p className="text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link to="/register" className="text-emerald-700 hover:underline">
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Subtle footer tint to echo the home style */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-white/70">
          © {new Date().getFullYear()} Iris & Oak. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
