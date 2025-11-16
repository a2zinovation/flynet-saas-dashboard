import React from "react";
import {
  Drawer,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";

// Figma Icons
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

export default function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const MenuItems = [
    { label: "Dashboard", icon: <DashboardOutlinedIcon />, path: "/dashboard" },
    { label: "All Business", icon: <BusinessCenterOutlinedIcon />, path: "/all-business" },
    { label: "Package Subscription", icon: <SellOutlinedIcon />, path: "/package-subscription" },
    { label: "Packages", icon: <Inventory2OutlinedIcon />, path: "/packages" },
    { label: "Reports", icon: <AssessmentOutlinedIcon />, path: "/reports" },
    { label: "Communicator", icon: <ChatOutlinedIcon />, path: "/communicator" },
    { label: "Notification center", icon: <NotificationsNoneOutlinedIcon />, path: "/notification-center" },
    { label: "Settings", icon: <SettingsOutlinedIcon />, path: "/settings" },
  ];

  const drawer = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#ffffff",
        borderRight: "1px solid #E5E7EB",
        px: 2,
        pt: 2,
        zIndex: 2000,           // ⭐ FIX: keeps Sidebar ABOVE Header
        position: "relative",   // ⭐ required so zIndex works
      }}
    >
      {/* ---- LOGO + HAMBURGER ---- */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pl: 0.5,               // ⭐ PERFECT ALIGNMENT (matches Figma)
          pr: 0.5,
          mb: 3,
        }}
      >
        <img
          src="/assets/flynet-logo.png"
          alt="Flynet Logo"
          style={{
            height: 36,
            cursor: "pointer",
            objectFit: "contain",
          }}
          onClick={() => navigate("/dashboard")}
        />

        <IconButton onClick={handleDrawerToggle} sx={{ color: "#0C2548", mr: -1 }}>
          <MenuIcon sx={{ fontSize: 26 }} />
        </IconButton>
      </Box>

      {/* ---- MENU ITEMS ---- */}
      <List sx={{ mt: 1 }}>
        {MenuItems.map((item, i) => {
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={i}
              onClick={() => navigate(item.path)}
              sx={{
                mb: 1,
                borderRadius: "8px",
                height: 48,
                px: 2,
                backgroundColor: active ? "#0C2548" : "transparent",
                "&:hover": {
                  backgroundColor: active ? "#0C2548" : "rgba(12, 37, 72, 0.05)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? "#ffffff" : "#0C2548",
                  minWidth: "34px",
                  "& svg": { fontSize: 20 },
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#ffffff" : "#0C2548",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            zIndex: 2000,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            zIndex: 2000,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
}
// flynet-multi-app/saas-dashboard/src/components/layout/Sidebar.jsx