// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

// PAGES
import Dashboard from "./pages/Dashboard";
import AllBusiness from "./pages/AllBusiness";
import AddBusiness from "./pages/AddBusiness";
import EditBusiness from "./pages/EditBusiness";
import Packages from "./pages/Packages";
import ActivityLog from "./pages/ActivityLog";
import AddPackage from "./pages/AddPackage";
import EditPackage from "./pages/EditPackage";
import PackageSubscriptions from "./pages/PackageSubscriptions";
import Reports from "./pages/Reports";
import Communicator from "./pages/Communicator";
import NotificationCenter from "./pages/NotificationCenter";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";   // ⭐ NEW

// AUTH
import Login from "./pages/auth/Login";
import RequireAuth from "./components/auth/RequireAuth";
import AuthLayout from "./layouts/AuthLayout";
export default function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* DEFAULT REDIRECT */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* PROTECTED ROUTES */}
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
        <Route path="/edit-business/:id" element={<EditBusiness />} />
        <Route path="/activity" element={<ActivityLog />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/add-package" element={<AddPackage />} />
        <Route path="/edit-package/:id" element={<EditPackage />} />
        <Route path="/package-subscription" element={<PackageSubscriptions />} />
        <Route path="/communicator" element={<Communicator />} />
        <Route path="/notification-center" element={<NotificationCenter />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}
