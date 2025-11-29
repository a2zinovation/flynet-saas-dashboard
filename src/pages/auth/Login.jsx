import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Checkbox, FormControlLabel, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
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
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      
      {/* Left Blue Image Section */}
      <Box
        sx={{
          width: "50%",
          backgroundImage: "url('/assets/auth/login-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img
          src="/assets/auth/auth-logo.png"
          alt="Flynet Logo"
          style={{ width: 180 }}
        />
      </Box>

      {/* Right Form Section */}
      <Box
        sx={{
          width: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4
        }}
      >
        <Paper sx={{ width: "75%", p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="700" textAlign="center" mb={1}>
            Welcome!
          </Typography>

          <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
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
              sx={{ mb: 2 }}
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
              disabled={loading}
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
