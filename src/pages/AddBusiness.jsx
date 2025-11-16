// src/pages/AddBusiness.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  MenuItem,
  Divider,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function AddBusiness() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    package: "",
    notes: "",
  });

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Business registered successfully (mock)!");
  };

  return (
    <Box>
      {/* ------- PAGE HEADER ------- */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: "none" }}
        >
          Back
        </Button>

        <Box>
          <Typography variant="h5" fontWeight="700">
            Add New Business
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Register a new business into the platform
          </Typography>
        </Box>
      </Stack>

      {/* ------- FORM CARD ------- */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid #E8EDF2",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Business Name */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Business Name *
              </Typography>
              <TextField
                fullWidth
                required
                placeholder="Enter business name"
                value={form.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
              />
            </Grid>

            {/* Owner Name */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Owner Name *
              </Typography>
              <TextField
                fullWidth
                required
                placeholder="Enter owner name"
                value={form.ownerName}
                onChange={(e) => handleChange("ownerName", e.target.value)}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Email *
              </Typography>
              <TextField
                fullWidth
                required
                type="email"
                placeholder="owner@email.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Phone Number *
              </Typography>
              <TextField
                fullWidth
                required
                type="phone"
                placeholder="+1 123 456 7890"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </Grid>

            {/* Country */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Country *
              </Typography>
              <TextField
                select
                fullWidth
                required
                value={form.country}
                onChange={(e) => handleChange("country", e.target.value)}
              >
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="UK">UK</MenuItem>
              </TextField>
            </Grid>

            {/* City */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                City *
              </Typography>
              <TextField
                fullWidth
                required
                placeholder="Enter city"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Address *
              </Typography>
              <TextField
                fullWidth
                required
                placeholder="Street, building, area..."
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Grid>

            {/* Package */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Select Package *
              </Typography>
              <TextField
                select
                fullWidth
                required
                value={form.package}
                onChange={(e) => handleChange("package", e.target.value)}
              >
                <MenuItem value="Starter">Starter - Free</MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="Unlimited">Unlimited</MenuItem>
              </TextField>
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Notes (optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="Internal notes..."
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* ------- ACTION BUTTONS ------- */}
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/business")}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#0C2548",
              }}
            >
              Register Business
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
