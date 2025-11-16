import React from "react";
import { Box, Paper, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", width: "100%", alignItems: "stretch" }}>
      <Box sx={{ flex: 1, background: "#0f4ea2", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="/assets/flynet-logo.png" alt="logo" style={{ width: 220 }} />
      </Box>

      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 6 }}>
        <Paper sx={{ width: "100%", maxWidth: 480, p: 4 }}>
          <Typography variant="h4" gutterBottom>Welcome!</Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="User name" variant="outlined" fullWidth sx={{ mb: 2 }} defaultValue="test@gmail.com" />
            <TextField label="Password" variant="outlined" type="password" fullWidth sx={{ mb: 2 }} defaultValue="password" />
            <Button type="submit" variant="contained" fullWidth>Login</Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
// flynet-multi-app/saas-dashboard/src/pages/Login.jsx