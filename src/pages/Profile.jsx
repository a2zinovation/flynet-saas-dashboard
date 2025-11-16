// src/pages/Profile.jsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
} from "@mui/material";

export default function Profile() {
  return (
    <Box>

      {/* PAGE TITLE */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        My Profile
      </Typography>

      {/* CHANGE PASSWORD */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid #E5E7EB",
          mb: 3,
        }}
      >
        <Typography fontWeight={600} sx={{ mb: 2 }}>
          Change Password
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              size="small"
              fullWidth
              label="Current password"
              type="password"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              size="small"
              fullWidth
              label="New password"
              type="password"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              size="small"
              fullWidth
              label="Confirm new password"
              type="password"
            />
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button
              variant="contained"
              sx={{
                mt: 1,
                backgroundColor: "#0C2548",
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* EDIT PROFILE + PROFILE PHOTO */}
      <Grid container spacing={3}>
        {/* Edit Profile */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #E5E7EB",
            }}
          >
            <Typography fontWeight={600} sx={{ mb: 2 }}>
              Edit Profile
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField size="small" fullWidth label="Prefix" defaultValue="Mr." />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField size="small" fullWidth label="First Name" defaultValue="Super" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField size="small" fullWidth label="Last Name" defaultValue="Admin" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Email" defaultValue="superadmin@example.com" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField size="small" fullWidth label="Language" defaultValue="English" />
              </Grid>

              <Grid item xs={12} textAlign="right">
                <Button
                  variant="contained"
                  sx={{
                    mt: 1,
                    backgroundColor: "#0C2548",
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Profile Photo */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #E5E7EB",
            }}
          >
            <Typography fontWeight={600} sx={{ mb: 2 }}>
              Profile Photo
            </Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload image:
            </Typography>

            <input type="file" />

            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
              Max file size: 5MB
            </Typography>

            <Box textAlign="right" sx={{ mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#0C2548",
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Update
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
