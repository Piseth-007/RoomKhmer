import React from "react";
import { Routes, Route } from "react-router-dom";

import ClientLayouts from "../layouts/ClientLayouts";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../components/pages/clients/Home";

import Login from "../components/pages/auth/Login";
import Register from "../components/pages/auth/Register";
import Rooms from "../components/pages/clients/Rooms";
import RoomDetail from "../components/pages/clients/RoomDetail";
import Locations from "../components/pages/clients/Locations";
import About from "../components/pages/clients/About";
import ForgotPassword from "../components/pages/auth/ForgotPassword";
import Contact from "../components/pages/clients/Contact";
import Favorites from "../components/pages/clients/Favorites";
import NotFound from "../components/pages/NotFound";
import Profile from "../components/pages/clients/Profile";
import Bookings from "../components/pages/clients/Bookings";
import LandlordLayout from "../layouts/LandlordLayout";
import LandlordDashboard from "../components/pages/landlord/LandlordDashboard";
import LandlordRooms from "../components/pages/landlord/LandlordRooms";
import CreateRoom from "../components/pages/landlord/CreateRoom";
import LandlordBookings from "../components/pages/landlord/LandlordBookings";
import EditRoom from "../components/pages/landlord/EditRoom";
import LandlordEarnings from "../components/pages/landlord/LandlordEarnings";
import LandlordProfile from "../components/pages/landlord/LandlordProfile";
import LandlordSettings from "../components/pages/landlord/LandlordSettings";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= CLIENT ================= */}

      <Route path="/" element={<ClientLayouts />}>
        <Route index element={<Home />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="rooms/:id" element={<RoomDetail />} />
        <Route path="locations" element={<Locations />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="profile" element={<Profile />} />
        <Route path="bookings" element={<Bookings />} />
      </Route>
      <Route path="*" element={<NotFound />} />

      {/* ================= AUTH ================= */}

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="/landlord" element={<LandlordLayout />}>
        <Route index element={<LandlordDashboard />} />
        <Route path="rooms" element={<LandlordRooms />} />
        <Route path="rooms/create" element={<CreateRoom />} />
        <Route path="rooms/:id/edit" element={<EditRoom/>}/>
        <Route path="bookings" element={<LandlordBookings/>}/>
        <Route path="earnings" element={<LandlordEarnings/>}/>
        <Route path="profile" element={<LandlordProfile/>}/>
        <Route path="settings" element={<LandlordSettings/>}/>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
