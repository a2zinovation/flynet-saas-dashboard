// src/components/layout/Header.jsx
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Select,
  FormControl,
  Stack,
  Divider,
  useTheme,
  Avatar,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";

import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import notificationService from "../../services/notificationService";

const Header = ({ drawerWidth }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const languages = [
    { code: "en-US", name: "EN-US", image: "/assets/flags/us.png" },
    { code: "es", name: "ES", image: "/assets/flags/es.png" },
    { code: "pt-BR", name: "PT-BR", image: "/assets/flags/br.png" },
  ];

  const [language, setLanguage] = useState("en-US");
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const isMenuOpen = Boolean(profileAnchor);

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    const result = await notificationService.getUnreadCount();
    if (result.success) {
      setUnreadCount(result.count);
    }
  };

  const handleProfileMenuOpen = (e) => setProfileAnchor(e.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchor(null);

  const openProfilePage = () => {
    handleProfileMenuClose();
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    handleProfileMenuClose();
    logout();
  };

  const Flag = ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      style={{ width: 22, height: 14, objectFit: "cover" }}
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  );

  const renderProfileMenu = (
    <Menu
      anchorEl={profileAnchor}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleProfileMenuClose}
      PaperProps={{
        elevation: 4,
        sx: { borderRadius: 2, mt: 1, minWidth: 220, p: 0 },
      }}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Signed in as
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {user?.name || "Super Admin"}
        </Typography>
      </Box>

      <Divider />

      <MenuItem onClick={openProfilePage}>
        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
        Profile
      </MenuItem>

      <MenuItem onClick={handleLogoutClick}>
        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
        Sign Out
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          // zIndex: (t) => t.zIndex.drawer + 2,
          backgroundColor: "transparent",
          color: "inherit",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: 74,
            pr: 3,
            ml: { xs: 0, sm: `${drawerWidth}px` },
          }}
        >
          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => window.dispatchEvent(new CustomEvent('toggleMobileMenu'))}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          
          {/* Desktop spacer */}
          <Box sx={{ display: { xs: "none", sm: "block" } }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Language Selector */}
            <FormControl size="small">
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                IconComponent={ArrowDropDownIcon}
                sx={{
                  background: "white",
                  borderRadius: 2,
                  px: 1,
                  py: 0.25,
                  minWidth: 120,
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                }}
                renderValue={(value) => {
                  const lang = languages.find((l) => l.code === value);
                  return (
                    <Stack direction="row" spacing={1}>
                      <Flag src={lang?.image} alt={lang?.name} />
                      <Typography fontSize={13}>{lang?.name}</Typography>
                    </Stack>
                  );
                }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    <Stack direction="row" spacing={1}>
                      <Flag src={lang.image} alt={lang.name} />
                      <Typography fontSize={13}>{lang.name}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Notifications */}
            <IconButton onClick={() => navigate("/notification-center")}>
              <Badge
                badgeContent={
                  typeof unreadCount === 'number'
                    ? unreadCount
                    : (unreadCount && typeof unreadCount.count === 'number' ? unreadCount.count : 0)
                }
                color="error"
                max={99}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

                  <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5 }}>
                    {(() => {
                    const picUrl = user?.profile_picture_url || user?.profile_picture;
                    // If picUrl is absent, render icon. If it's a relative path (like "profiles/xxx.jpg"),
                    // build a full URL pointing to /storage/<path>. Allow override via env var.
                    const apiBase = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";
                    const imageUrl =
                      picUrl && (picUrl.startsWith("http") || picUrl.startsWith("https"))
                      ? picUrl
                      : picUrl
                      ? `${apiBase}/storage/${String(picUrl).replace(/^\/+/, "")}`
                      : null;

                    return imageUrl ? (
                      <Avatar
                      src={imageUrl}
                      alt={user?.name || "User"}
                      sx={{ width: 36, height: 36 }}
                      />
                    ) : (
                      <AccountCircle sx={{ fontSize: 36 }} />
                    );
                    })()}
                  </IconButton>

                  {/* Red Logout Button */}
            <IconButton
              onClick={logout}
              sx={{
                backgroundColor: "#ff4d4f",
                color: "#fff",
                "&:hover": { backgroundColor: "#e03f3f" },
                boxShadow: "0 3px 10px rgba(255,77,79,0.2)",
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderProfileMenu}
    </>
  );
};

export default Header;
