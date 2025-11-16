// src/layouts/MainLayout.jsx
import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72; // icons-only width

export default function MainLayout() {
  // controls mobile drawer (for xs screens)
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen((s) => !s);

  // controls collapsed (desktop) state
  const [isCollapsed, setIsCollapsed] = useState(false);

  const effectiveSidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      {/* Sidebar — receives mobile + collapsed controls */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        drawerWidth={SIDEBAR_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      />

      {/* Main area — leave room for sidebar using effective width */}
      <Box
        sx={{
          flexGrow: 1,
          // keep header visible; shift main content to the right by sidebar width
          ml: `${effectiveSidebarWidth}px`,
          display: "flex",
          flexDirection: "column",
          transition: "margin 0.18s ease",
          minHeight: "100vh",
          bgcolor: "transparent",
        }}
      >
        {/* Header receives the mobile drawer toggle so hamburger still works on xs */}
        <Header drawerWidth={effectiveSidebarWidth} handleDrawerToggle={handleDrawerToggle} />

        {/* Page Content */}
        <Box component="main" sx={{ p: 3, pt: "84px", minHeight: "calc(100vh - 84px)" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
