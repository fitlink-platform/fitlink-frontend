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

import ResetPasswordPage from '~/pages/ResetPasswordPage'
import ForgotPasswordPage from '~/pages/ForgotPasswordPage'
import DashboardPage from '~/pages/admin/dashboardAdmin/DashboardPage'
import PTDashboard from '~/pages/pt/PTDashboard'
import PTPackages from '~/pages/pt/PTPackages'
import PTProfile from '~/pages/pt/PTProfile'
import PTDetail from '~/pages/student/PTDetail'
import PTMessagePage from '~/pages/pt/PTMessagePage'
import PaymentResult from '~/pages/payment/PaymentResult'
import MyCalendar from '~/pages/calendar/MyCalendar'
import PTStudents from '~/pages/pt/PTStudent'
import MessagePage from '~/pages/MessagePage'
import ChatAIPage from '~/pages/AIChatPage'
import PTListAdmin from '~/pages/admin/managerUser/PTList';
import StudentListAdmin from '~/pages/admin/managerUser/StudentList';
import AdminLayout from "~/layouts/AdminLayout";
import SearchPTs from '~/pages/student/SearchPTs';
import PTCalendarPage from "~/pages/pt/PTCalendarPage";
import PTRequestList from "~/pages/admin/PTRequestList";
import PTRequestDetail from "~/pages/admin/PTRequestDetail";
import PTCreatePackage from "~/pages/pt/PTCreatePackage";
import PTSchedule from "~/pages/pt/PTSchedule";
import BookingWizard from "~/pages/booking/BookingWizard";
import NotificationsPage from "~/pages/student/NotificationsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/list-pt" element={<SearchPTs />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={["student", "pt"]}>
            <UserProfile />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/chat"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <MessagePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/chat/:ptId"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <MessagePage />
          </PrivateRoute>
        }
      />
      <Route path="/chat-ai" element={<ChatAIPage />} />

      {/* Trainer - Nguyen */}
      <Route path="/trainer/:id" element={<PTDetail />} />
      <Route path="/pt/:id" element={<PTDetail />} />
      {/* <Route path="/booking/:id" element={<BookingPage />} />
       */}
      <Route path="/booking/:id" element={<BookingWizard />} />
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
      <Route
        path="/admin/users/pts"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout>
              <PTListAdmin />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users/students"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout>
              <StudentListAdmin />
            </AdminLayout>
          </PrivateRoute>
        }
      />
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
      <Route path="/pt/packages/new" element={<PrivateRoute allowedRoles={["pt"]}><PTCreatePackage /></PrivateRoute>} />
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
      <Route path="/pt/schedule1" element={<MyCalendar />} />
      <Route path="/pt/schedule" element={<PTSchedule />} />
      {/* Student có thể dùng cùng page này nếu muốn, hoặc tách ra layout khác */}
      <Route path="/pt/students" element={<PTStudents />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route
        path="/pt/chat"
        element={
          <PrivateRoute allowedRoles={["pt"]}>
            <PTMessagePage />
          </PrivateRoute>
        }
      />


    </Routes>
  );
}
