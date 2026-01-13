import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Login failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden"
      }}
    >
      {/* LEFT IMAGE AREA */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          height: isMobile ? "220px" : "100vh",
          backgroundImage: "url('/assets/auth/login-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: isMobile ? 2 : 0
        }}
      >
        <img
          src="/assets/auth/auth-logo.png"
          alt="Flynet Logo"
          style={{
            width: isMobile ? "45%" : "180px",
            height: "auto"
          }}
        />
      </Box>

      {/* RIGHT FORM AREA */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: isMobile ? 3 : 6
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: isMobile ? 360 : 420,
            p: isMobile ? 3 : 4,
            borderRadius: 3
          }}
        >
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
            Admin Login
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >
            Access restricted to Super Administrators only
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <FormControlLabel control={<Checkbox />} label="Remember Me" />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.2,
                textTransform: "none",
                backgroundColor: "#0C2548"
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
