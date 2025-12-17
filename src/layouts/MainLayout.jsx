// src/layouts/MainLayout.jsx
import React, { useState } from "react";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;

export default function MainLayout() {
  const isTablet = useMediaQuery("(max-width:900px)");
  const isMobile = useMediaQuery("(max-width:600px)");

  // MOBILE drawer state
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // DESKTOP collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 🔥 Auto-collapse on tablets but not phones
  const effectiveCollapsed = isMobile ? true : isTablet ? true : isCollapsed;

  const effectiveSidebarWidth = effectiveCollapsed
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      {/* SIDEBAR */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isCollapsed={effectiveCollapsed}
        setIsCollapsed={setIsCollapsed}
        drawerWidth={SIDEBAR_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      />

      {/* RIGHT AREA */}
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, sm: `${effectiveSidebarWidth}px` },
          transition: "margin 0.2s ease",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header
          drawerWidth={effectiveSidebarWidth}
          handleDrawerToggle={handleDrawerToggle}
        />

        {/* PAGE CONTENT */}
        <Box
          component="main"
          sx={{
            p: 3,
            pt: "84px",
            minHeight: "calc(100vh - 84px)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}