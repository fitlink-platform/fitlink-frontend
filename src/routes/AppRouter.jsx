import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "~/pages/customer/HomePage";
import PrivateRoute from "./PrivateRoute";
import AboutPage from "~/pages/customer/AboutPage";
import ShopPage from "~/pages/customer/ShopPage";
import RegisterPage from "~/pages/RegisterPage";
import NewsPage from "~/pages/customer/NewsPage";
import ContactPage from "~/pages/customer/ContactPage";
import UserProfile from "~/pages/customer/UserProfile";
import UnauthorizedPage from "~/pages/UnauthorizedPage";
import ProductDetailPage from "~/pages/customer/ProductDetailPage";
import OrderPage from "~/pages/customer/OrderPage";
import OrderSuccess from "~/pages/customer/OrderSuccess";
import OrderDetail from "~/pages/customer/OrderDetail";
import OrderHistoryPage from "~/pages/customer/OrderHistoryPage";
{
  /* admin */
}
{
  /* admin */
}
import ManagerUser from "../pages/admin/managerUser/ManagerUser";
import UserDetail from "../pages/admin/ManagerUser/UserDetail";

import ResetPasswordPage from "~/pages/ResetPasswordPage";
import ForgotPasswordPage from "~/pages/ForgotPasswordPage";
import DashboardPage from "../pages/admin/dashboardAdmin/DashboardPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route
        path="/customer/profile"
        element={
          <PrivateRoute allowedRoles={["customer"]}>
            <UserProfile />
          </PrivateRoute>
        }
      />
          <Route
        path="/customer/orders"
        element={
          <PrivateRoute allowedRoles={["customer"]}>
            <OrderHistoryPage />
          </PrivateRoute>
        }
      />
           <Route
        path="/customer/orders/:id"
        element={
          <PrivateRoute allowedRoles={["customer"]}>
            <OrderDetail />
          </PrivateRoute>
        }
      />

      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/orderSuccess" element={<OrderSuccess />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/shop" element={<ShopPage />} />
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
    </Routes>
  );
}
