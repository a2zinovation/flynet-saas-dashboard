// src/layouts/MainLayout.jsx
import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";

const SIDEBAR_WIDTH = 240;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      {/* Sidebar — fixed left */}
      <Sidebar
        width={SIDEBAR_WIDTH}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main area */}
      <Box
        sx={{
          flexGrow: 1,
          ml: `${SIDEBAR_WIDTH}px`, // space for sidebar
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Transparent Header */}
        <Header />

        {/* Page Content */}
        <Box sx={{ padding: 3, mt: "80px" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
// src/layouts/MainLayout.jsx