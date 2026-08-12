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
      </Route>

      {/* ================= AUTH ================= */}

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword/>}/>
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
