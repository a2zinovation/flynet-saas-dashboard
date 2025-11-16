import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export default function AuthLayout() {
  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <Outlet />
    </Box>
  );
}
// src/layouts/AuthLayout.jsx