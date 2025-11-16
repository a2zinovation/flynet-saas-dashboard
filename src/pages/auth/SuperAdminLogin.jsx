import React from "react";
import { Box, Paper, TextField, Button, Typography, Checkbox, FormControlLabel } from "@mui/material";

export default function SuperAdminLogin() {
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

          <TextField fullWidth label="User name" sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" type="password" sx={{ mb: 2 }} />
          <FormControlLabel control={<Checkbox />} label="Remember Me" />
          <Button fullWidth variant="contained" sx={{ mt: 2 }}>Login</Button>
        </Paper>
      </Box>
    </Box>
  );
}
// flynet-multi-app/saas-dashboard/src/pages/auth/SuperAdminLogin.jsx