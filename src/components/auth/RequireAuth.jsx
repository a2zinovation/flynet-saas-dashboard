import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Box, Typography, Paper, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function RequireAuth({ children }) {
  const { user, isSuperAdmin, logout } = useAuth();

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is super admin
  if (!isSuperAdmin()) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: 500,
            p: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <LockIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
          <Typography variant="h5" fontWeight="700" sx={{ mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You do not have permission to access this system. Only Super Admins can access the SAAS Dashboard.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            sx={{ textTransform: "none" }}
          >
            Return to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return children;
}
