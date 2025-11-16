import React, { useState } from "react";
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
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Header = ({ drawerWidth, handleDrawerToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Language data (use your public assets folder)
  const languages = [
    { code: "en-US", name: "EN-US", image: "/assets/flags/us.png" },
    { code: "es", name: "ES", image: "/assets/flags/es.png" },
    { code: "pt-BR", name: "PT-BR", image: "/assets/flags/br.png" },
  ];

  const [language, setLanguage] = useState("en-US");
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const isMenuOpen = Boolean(profileAnchor);

  const handleProfileMenuOpen = (e) => setProfileAnchor(e.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchor(null);

  const handleLogout = () => {
    handleProfileMenuClose();
    logout && logout();
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate("/user/profile");
  };

  // Profile dropdown (Signed in as + actions)
  const renderProfileMenu = (
    <Menu
      anchorEl={profileAnchor}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleProfileMenuClose}
      PaperProps={{
        elevation: 4,
        sx: {
          borderRadius: 2,
          mt: 1,
          minWidth: 220,
          p: 0,
        },
      }}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="body2" color="text.secondary">Signed in as</Typography>
        <Typography variant="body1" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
          {user?.name || "Super Admin"}
        </Typography>
      </Box>

      <Divider />

      <MenuItem onClick={handleProfileClick}>
        <PersonIcon fontSize="small" sx={{ mr: 1, color: "black" }} />
        <Typography variant="body1">Profile</Typography>
      </MenuItem>

      <MenuItem onClick={handleLogout}>
        <LogoutIcon fontSize="small" sx={{ mr: 1, color: "black" }} />
        <Typography variant="body1">Sign Out</Typography>
      </MenuItem>
    </Menu>
  );

  // small helper to safely render flag (fallback to text)
  const Flag = ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      style={{ width: 22, height: 14, objectFit: "cover", display: "inline-block" }}
      onError={(e) => {
        // fallback: hide broken image (we'll still show the code text)
        e.currentTarget.style.display = "none";
      }}
    />
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 2,
          backgroundColor: "transparent",
          color: "inherit",
          backdropFilter: "blur(3px)",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            [theme.breakpoints.up("sm")]: { ml: `${drawerWidth}px` },
            minHeight: 74,
            pr: 3,
          }}
        >
          {/* left spacer - hamburger remains in sidebar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} />

          {/* right controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Language selector */}
            <FormControl variant="outlined" size="small">
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                IconComponent={ArrowDropDownIcon}
                sx={{
                  background: "white",
                  borderRadius: 2,
                  px: 1,
                  py: 0.25,
                  display: "flex",
                  alignItems: "center",
                  minWidth: 120,
                  "& .MuiSelect-select": { display: "flex", alignItems: "center", gap: 1 },
                }}
                renderValue={(selectedCode) => {
                  const lang = languages.find((l) => l.code === selectedCode);
                  return (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Flag src={lang?.image} alt={lang?.name} />
                      <Typography fontSize={13}>{lang?.name ?? selectedCode}</Typography>
                    </Stack>
                  );
                }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Flag src={lang.image} alt={lang.name} />
                      <Typography fontSize={13}>{lang.name}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Notifications */}
            <IconButton
              size="large"
              color="inherit"
              onClick={() => navigate("/admin/notifications")}
              sx={{ background: "transparent", "&:hover": { background: "rgba(0,0,0,0.04)" } }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon sx={{ color: theme.palette.text.primary }} />
              </Badge>
            </IconButton>

            {/* Profile */}
            <IconButton
              size="large"
              onClick={handleProfileMenuOpen}
              sx={{ background: "transparent", "&:hover": { background: "rgba(0,0,0,0.04)" } }}
            >
              <AccountCircle sx={{ color: theme.palette.text.primary }} />
            </IconButton>

            {/* Direct logout (red outer icon) */}
            <IconButton
              size="medium"
              onClick={logout}
              sx={{
                ml: 0.5,
                backgroundColor: "#ff4d4f",
                color: "#fff",
                "&:hover": { backgroundColor: "#e03f3f" },
                boxShadow: "0 3px 10px rgba(255,77,79,0.15)",
              }}
              aria-label="sign out"
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
// flynet-multi-app/saas-dashboard/src/components/layout/Header.jsx