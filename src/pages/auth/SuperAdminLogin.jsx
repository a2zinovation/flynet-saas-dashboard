import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography, Checkbox, FormControlLabel, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SuperAdminLogin() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box sx={{ flex: 1, background: "#0f4a85", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="/assets/auth-logo.png" alt="flynet" style={{ width: 220 }} />
      </Box>

      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 6 }}>
        <Paper sx={{ width: "100%", maxWidth: 520, p: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
            Welcome!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Login to your Super admin
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
              disabled={loading}
              required
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              sx={{ mb: 2 }} 
            />
            <FormControlLabel control={<Checkbox />} label="Remember Me" />
            <Button 
              fullWidth 
              variant="contained" 
              type="submit"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
// flynet-multi-app/saas-dashboard/src/pages/auth/SuperAdminLogin.jsx