// src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from "react";
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
  Badge,
  useMediaQuery,
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
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import notificationService from "../../services/notificationService";

export default function Sidebar({
  mobileOpen,
  handleDrawerToggle,
  isCollapsed,
  setIsCollapsed,
  drawerWidth = 240,
  collapsedWidth = 72,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Listen for mobile menu toggle event
  useEffect(() => {
    const handleToggle = () => handleDrawerToggle();
    window.addEventListener('toggleMobileMenu', handleToggle);
    return () => window.removeEventListener('toggleMobileMenu', handleToggle);
  }, [handleDrawerToggle]);

  const fetchUnreadCount = async () => {
    const result = await notificationService.getUnreadCount();
    if (result.success) {
      setUnreadCount(result.count);
    }
  };

// Breakpoints
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:600px) and (max-width:899px)");

  // Auto-collapse below 900px
  const autoCollapsed = isMobile || isTablet ? true : isCollapsed;

  // Width depending on collapsed/expanded state
  const effectiveWidth = autoCollapsed ? collapsedWidth : drawerWidth;

  // Menu list
  const MenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardOutlinedIcon /> },
    { label: "All Business", path: "/all-business", icon: <BusinessCenterOutlinedIcon /> },
    { label: "Packages", path: "/packages", icon: <Inventory2OutlinedIcon /> },
    { label: "Activity Logs", path: "/activity", icon: <ReceiptLongOutlinedIcon /> },
    { label: "Communicator", path: "/communicator", icon: <ChatOutlinedIcon /> },
    { label: "Notification Center", path: "/notification-center", icon: <NotificationsNoneOutlinedIcon /> },
    { label: "Settings", path: "/settings", icon: <SettingsOutlinedIcon /> },
    { label: "Reports", path: "/reports", icon: <AssessmentOutlinedIcon /> },
  ];

  // Function to render drawer content - accepts forceExpanded parameter
  const renderDrawerContent = (forceExpanded = false) => {
    const shouldCollapse = forceExpanded ? false : autoCollapsed;

    return (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#ffffff",
        borderRight: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        px: shouldCollapse ? 0.5 : 2,
        pt: 2,
      }}
    >

      {/* ----------------------------------------------------- */}
      {/* LOGO + COLLAPSE / EXPAND BUTTONS */}
      {/* ----------------------------------------------------- */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: shouldCollapse ? "column" : "row",
          alignItems: "center",
          justifyContent: shouldCollapse ? "center" : "space-between",         
           mb: 3,
          transition: "all 0.2s ease",
        }}
      >
        {/* LOGO */}
         <Box
          sx={{
            cursor: "pointer",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            width: shouldCollapse ? "100%" : "auto",
            mb: shouldCollapse ? 1.2 : 0,
          }}
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={shouldCollapse ? "/assets/short-logo.png" : "/assets/flynet-logo.png"}
            alt="Flynet Logo"
            style={{
              height: shouldCollapse ? 40 : 36,
              maxWidth: shouldCollapse ? 40 : 160,
              objectFit: "contain",
              transition: "all 0.16s ease",
            }}
          />
        </Box>

        {/* COLLAPSE BUTTON — ONLY SHOW ON >= 900px */}
        {!isMobile && !isTablet && !shouldCollapse && !forceExpanded && (
          <IconButton onClick={() => setIsCollapsed(true)} sx={{ color: "#0C2548" }}>
            <MenuIcon />
          </IconButton>
        )}

        {/* EXPAND BUTTON — ONLY SHOW ON >= 900px */}
        {!isMobile && !isTablet && shouldCollapse && !forceExpanded && (
          <IconButton
            onClick={() => setIsCollapsed(false)}
            sx={{
              bgcolor: "#ffffff",
              border: "1px solid rgba(12,37,72,0.08)",
              width: 36,
              height: 36,
              transition: "all 0.16s ease",
            }}
          >
            <ChevronLeftIcon sx={{ transform: "rotate(180deg)" }} />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* ----------------------------------------------------- */}
      {/* MENU ITEMS */}
      {/* ----------------------------------------------------- */}
      <List sx={{ mt: 1}}>
        {MenuItems.map((item, i) => {
          const active = location.pathname === item.path;

          // Show badge for notification center
          const showBadge = item.path === "/notification-center" && unreadCount > 0;

          /* COLLAPSED MODE — Icons only */
          if (shouldCollapse) {
            return (
              <Tooltip title={item.label} placement="right" key={i}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    mb: 1,
                    borderRadius: "8px",
                    height: 56,
                    justifyContent: "center",
                    backgroundColor: active ? "#0C2548" : "transparent",
                    "&:hover": { backgroundColor: active ? "#0C2548" : "rgba(12,37,72,0.08)" },
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
                    {showBadge ? (
                      <Badge badgeContent={unreadCount} color="error" max={99}>
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
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
                {showBadge ? (
                  <Badge badgeContent={unreadCount} color="error" max={99}>
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
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
  };

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
            zIndex: (theme) => theme.zIndex.drawer + 3,
          },
        }}
      >{renderDrawerContent(true)}
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
            zIndex: (theme) => theme.zIndex.drawer + 1,
          },
        }}
      >
        {renderDrawerContent(false)}
        {/* {drawerContent} */}
      </Drawer>
    </>
  );
}
