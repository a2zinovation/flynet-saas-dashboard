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
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },   // 🔥 STACK on mobile
      }}
    >
      {/* LEFT SIDE IMAGE / LOGO */}
      <Box
        sx={{
          flex: 1,
          background: "#0f4ea2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 4, md: 0 },   // 🔥 padding for mobile
        }}
      >
        <img
          src="/assets/flynet-logo.png"
          alt="logo"
          style={{
            width: "70%",
            maxWidth: 260,        // 🔥 scales nicely
            height: "auto",
          }}
        />
      </Box>

      {/* RIGHT SIDE FORM */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 4, md: 6 },   // 🔥 responsive padding
        }}
      >
        <Paper
          sx={{
            width: "100%",
            maxWidth: 440,
            p: { xs: 3, md: 4 },         // 🔥 responsive padding
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome!
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="User name"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              defaultValue="test@gmail.com"
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ mb: 3 }}
              defaultValue="password"
            />

            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
