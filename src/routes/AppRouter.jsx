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
import PTList from "~/pages/student/PTList";
import ManagerUser from "../pages/admin/managerUser/ManagerUser";
import UserDetail from "../pages/admin/ManagerUser/UserDetail";

import ResetPasswordPage from "~/pages/ResetPasswordPage";
import ForgotPasswordPage from "~/pages/ForgotPasswordPage";
import DashboardPage from "~/pages/admin/dashboardAdmin/DashboardPage";
import PTDashboard from "~/pages/pt/PTDashboard";
import PTCalendarPage from "~/pages/pt/PTCalendarPage";
import PTPackages from "~/pages/pt/PTPackages";
import PTProfile from "~/pages/pt/PTProfile";
import PTDetail from "~/pages/student/PTDetail";
import PaymentResult from "~/pages/payment/PaymentResult";
import MyCalendar from "~/pages/calendar/MyCalendar";
import PTStudents from "~/pages/pt/PTStudent";
import PTRequestList from "~/pages/admin/PTRequestList";
import PTRequestDetail from "~/pages/admin/PTRequestDetail";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/list-pt" element={<PTList />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={["student", "pt"]}>
            <UserProfile />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Trainer - Nguyen */}
      <Route path="/trainer/:id" element={<PTDetail />} />
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
      <Route path="/pt" element={<Navigate to="/pt/dashboard" replace />} />
      <Route path="/admin/pt-requests" element={<PTRequestList />} />
      <Route path="/admin/pt-requests/:id" element={<PTRequestDetail />} />
      <Route
        path="/pt/dashboard"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTDashboard />
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/pt/schedule"
        element={
          <PrivateRoute allowedRoles={['pt']}>
            <PTCalendarPage />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/pt/packages"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTPackages />
          </PrivateRoute>
        }
      />
      <Route
        path="/pt/profile"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTProfile />
          </PrivateRoute>
        }
      />
      <Route path="/payment/result" element={<PaymentResult />} />

      {/* ... */}
      <Route path="/pt/schedule" element={<MyCalendar />} />
      {/* Student có thể dùng cùng page này nếu muốn, hoặc tách ra layout khác */}
      <Route path="/pt/students" element={<PTStudents />} />
    </Routes>
  );
}
