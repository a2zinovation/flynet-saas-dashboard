// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

// PAGES
import Dashboard from "./pages/Dashboard";
import AllBusiness from "./pages/AllBusiness";
import AddBusiness from "./pages/AddBusiness";
import Packages from "./pages/Packages";
import PackageSubscriptions from "./pages/PackageSubscriptions";
import Reports from "./pages/Reports";
import Communicator from "./pages/Communicator";
import NotificationCenter from "./pages/NotificationCenter";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";   // ⭐ NEW

// AUTH
import Login from "./pages/Auth/Login";
import RequireAuth from "./components/auth/RequireAuth";

export default function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* PROTECTED */}
      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/all-business" element={<AllBusiness />} />
        <Route path="/add-business" element={<AddBusiness />} />

        <Route path="/packages" element={<Packages />} />
        <Route path="/package-subscription" element={<PackageSubscriptions />} />

        <Route path="/reports" element={<Reports />} />
        <Route path="/communicator" element={<Communicator />} />

        <Route path="/notification-center" element={<NotificationCenter />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/profile" element={<Profile />} /> {/* ⭐ NEW */}
      </Route>

      {/* 404 → HOME */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
