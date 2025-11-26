// src/components/layout/Sidebar.jsx
import React from "react";
import {
  Drawer,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  useTheme,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export default function Sidebar({
  mobileOpen,
  handleDrawerToggle,
  isCollapsed = false,
  setIsCollapsed = () => {},
  drawerWidth = 240,
  collapsedWidth = 72,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const MenuItems = [
  { label: "Dashboard", icon: <DashboardOutlinedIcon />, path: "/dashboard" },
  { label: "All Business", icon: <BusinessCenterOutlinedIcon />, path: "/all-business" },
  { label: "Packages", icon: <Inventory2OutlinedIcon />, path: "/packages" },
  { label: "Reports", icon: <AssessmentOutlinedIcon />, path: "/reports" },
  { label: "Communicator", icon: <ChatOutlinedIcon />, path: "/communicator" },
  { label: "Notification center", icon: <NotificationsNoneOutlinedIcon />, path: "/notification-center" },
  { label: "Settings", icon: <SettingsOutlinedIcon />, path: "/settings" },
];


  const effectiveWidth = isCollapsed ? collapsedWidth : drawerWidth;

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#ffffff",
        borderRight: "1px solid #E5E7EB",
        px: isCollapsed ? 0.5 : 2,
        pt: 2,
        position: "relative",
        zIndex: 2000,
        overflow: "hidden",
      }}
    >

      {/* ----------------------------------------------------- */}
      {/* LOGO + COLLAPSE / EXPAND BUTTONS */}
      {/* ----------------------------------------------------- */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: isCollapsed ? "column" : "row",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          mb: 3,
          px: isCollapsed ? 0.5 : 0,
          transition: "all 0.2s ease",
        }}
      >
        {/* LOGO */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            justifyContent: "center",
            width: isCollapsed ? "100%" : "auto",
            mb: isCollapsed ? 1.2 : 0,
          }}
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={isCollapsed ? "/assets/short-logo.png" : "/assets/flynet-logo.png"}
            alt="Flynet Logo"
            style={{
              height: isCollapsed ? 40 : 36,
              maxWidth: isCollapsed ? 40 : 160,
              objectFit: "contain",
              transition: "all 0.16s ease",
            }}
          />
        </Box>

        {/* COLLAPSE BUTTON (expanded view) */}
        {!isCollapsed && (
          <IconButton
            onClick={() => setIsCollapsed(true)}
            sx={{ color: "#0C2548" }}
            aria-label="Collapse sidebar"
            size="small"
          >
            <MenuIcon sx={{ fontSize: 22 }} />
          </IconButton>
        )}

        {/* EXPAND BUTTON (collapsed view) */}
        {isCollapsed && (
          <IconButton
            onClick={() => setIsCollapsed(false)}
            aria-label="Expand sidebar"
            sx={{
              bgcolor: theme.palette.background.paper,
              border: "1px solid rgba(12,37,72,0.06)",
              width: 36,
              height: 36,
              transition: "all 0.16s ease",
            }}
            size="small"
          >
            <ChevronLeftIcon sx={{ transform: "rotate(180deg)" }} />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* ----------------------------------------------------- */}
      {/* MENU ITEMS */}
      {/* ----------------------------------------------------- */}
      <List sx={{ mt: 1, px: isCollapsed ? 0 : 1 }}>
        {MenuItems.map((item, i) => {
          const active = location.pathname === item.path;

          /* COLLAPSED MODE — Icons only */
          if (isCollapsed) {
            return (
              <Tooltip title={item.label} placement="right" key={i}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    mb: 1,
                    borderRadius: "8px",
                    height: 56,
                    justifyContent: "center",
                    px: 1,
                    backgroundColor: active ? "#0C2548" : "transparent",
                    "&:hover": { backgroundColor: active ? "#0C2548" : "rgba(12,37,72,0.05)" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? "#ffffff" : "#0C2548",
                      minWidth: 0,
                      display: "flex",
                      justifyContent: "center",
                      "& svg": { fontSize: 20 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            );
          }

          /* EXPANDED MODE — Label + Icon */
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
                  backgroundColor: active ? "#0C2548" : "rgba(12,37,72,0.05)",
                },
                transition: "0.12s ease",
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

      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <>
      {/* MOBILE SIDEBAR */}
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
        {drawerContent}
      </Drawer>

      {/* DESKTOP SIDEBAR */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: effectiveWidth,
            boxSizing: "border-box",
            transition: "width 0.16s ease",
            overflowX: "hidden",
            zIndex: 2000,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
