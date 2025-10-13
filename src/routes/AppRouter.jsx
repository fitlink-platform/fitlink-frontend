import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "~/pages/student/HomePage";
import PrivateRoute from "./PrivateRoute";
import AboutPage from "~/pages/student/AboutPage";
import RegisterPage from "~/pages/RegisterPage";
import NewsPage from "~/pages/student/NewsPage";
import ContactPage from "~/pages/student/ContactPage";
import UserProfile from "~/pages/student/UserProfile";
import UnauthorizedPage from "~/pages/UnauthorizedPage";
import VerifyEmail from "~/pages/VerifyEmail";

import ManagerUser from "../pages/admin/managerUser/ManagerUser";
import UserDetail from "../pages/admin/ManagerUser/UserDetail";

import ResetPasswordPage from "~/pages/ResetPasswordPage";
import ForgotPasswordPage from "~/pages/ForgotPasswordPage";
import DashboardPage from "~/pages/admin/dashboardAdmin/DashboardPage";
import PTDashboard from "~/pages/pt/PTDashboard";
import PTCalendarPage from "~/pages/pt/PTCalendarPage";
import PTPackages from "~/pages/pt/PTPackages";
import PTProfile from "~/pages/pt/PTProfile";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={["student", "pt"]}>
            <UserProfile />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/home" replace/>} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      {/* Admin router */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route path="/admin/users" element={<ManagerUser />} />
      <Route path="/admin/users/:id" element={<UserDetail />} />

      <Route path="/pt" element={<Navigate to="/pt/dashboard" replace/>} />
      <Route path="/pt/dashboard" element={<PrivateRoute allowedRoles={["pt"]}><PTDashboard /></PrivateRoute>} />
      <Route path="/pt/schedule" element={<PrivateRoute allowedRoles={["pt"]}><PTCalendarPage /></PrivateRoute>} />
      <Route path="/pt/packages" element={<PrivateRoute allowedRoles={["pt"]}><PTPackages/></PrivateRoute>} />
      <Route path="/pt/profile" element={<PrivateRoute allowedRoles={["pt"]}><PTProfile/></PrivateRoute>} />


    </Routes>
  );
}
