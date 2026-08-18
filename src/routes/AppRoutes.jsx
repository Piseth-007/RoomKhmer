import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import ClientLayouts from "../layouts/ClientLayouts";
import AuthLayout from "../layouts/AuthLayout";

import LandlordLayout from "../layouts/LandlordLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

const Home = lazy(() => import("../components/pages/clients/Home"));
const Login = lazy(() => import("../components/pages/auth/Login"));
const Register = lazy(() => import("../components/pages/auth/Register"));
const Rooms = lazy(() => import("../components/pages/clients/Rooms"));
const RoomDetail = lazy(() => import("../components/pages/clients/RoomDetail"));
const Locations = lazy(() => import("../components/pages/clients/Locations"));
const About = lazy(() => import("../components/pages/clients/About"));
const ForgotPassword = lazy(() => import("../components/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/pages/auth/ResetPassword"));
const Contact = lazy(() => import("../components/pages/clients/Contact"));
const Favorites = lazy(() => import("../components/pages/clients/Favorites"));
const NotFound = lazy(() => import("../components/pages/NotFound"));
const Profile = lazy(() => import("../components/pages/clients/Profile"));
const Bookings = lazy(() => import("../components/pages/clients/Bookings"));
const LandlordDashboard = lazy(() => import("../components/pages/landlord/LandlordDashboard"));
const LandlordRooms = lazy(() => import("../components/pages/landlord/LandlordRooms"));
const CreateRoom = lazy(() => import("../components/pages/landlord/CreateRoom"));
const LandlordBookings = lazy(() => import("../components/pages/landlord/LandlordBookings"));
const EditRoom = lazy(() => import("../components/pages/landlord/EditRoom"));
const LandlordEarnings = lazy(() => import("../components/pages/landlord/LandlordEarnings"));
const LandlordProfile = lazy(() => import("../components/pages/landlord/LandlordProfile"));
const LandlordSettings = lazy(() => import("../components/pages/landlord/LandlordSettings"));
const AdminDashboard = lazy(() => import("../components/pages/admin/AdminDashboard"));
const AdminRooms = lazy(() => import("../components/pages/admin/AdminRooms"));
const AdminUsers = lazy(() => import("../components/pages/admin/AdminUsers"));
const AdminBookings = lazy(() => import("../components/pages/admin/AdminBookings"));
const AdminReports = lazy(() => import("../components/pages/admin/AdminReports"));
const AdminProfile = lazy(() => import("../components/pages/admin/AdminProfile"));
const AdminSettings = lazy(() => import("../components/pages/admin/AdminSettings"));

const AppRoutes = () => (
  <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
    <Routes>

    <Route path="/" element={<ClientLayouts />}>
      <Route index element={<Home />} />
      <Route path="rooms" element={<Rooms />} />
      <Route path="rooms/:id" element={<RoomDetail />} />
      <Route path="locations" element={<Locations />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route
        path="favorites"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="bookings"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Bookings />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route path="*" element={<NotFound />} />


    <Route path="/auth" element={<AuthLayout />}>
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="register" element={<Register />} />
    </Route>
    <Route
      path="/landlord"
      element={
        <ProtectedRoute allowedRoles={["landlord"]}>
          <LandlordLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<LandlordDashboard />} />
      <Route path="rooms" element={<LandlordRooms />} />
      <Route path="rooms/create" element={<CreateRoom />} />
      <Route path="rooms/:id/edit" element={<EditRoom />} />
      <Route path="bookings" element={<LandlordBookings />} />
      <Route path="earnings" element={<LandlordEarnings />} />
      <Route path="profile" element={<LandlordProfile />} />
      <Route path="settings" element={<LandlordSettings />} />
    </Route>
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="rooms" element={<AdminRooms />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="bookings" element={<AdminBookings />} />
      <Route path="reports" element={<AdminReports />} />
      <Route path="profile" element={<AdminProfile />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
