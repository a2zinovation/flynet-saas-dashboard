// src/pages/AddBusiness.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PublicIcon from "@mui/icons-material/Public";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

export default function AddBusiness() {
  const [form, setForm] = useState({});

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Box sx={{ px: "42px", py: "30px", width: "100%" }}>
      {/* PAGE TITLE */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "22px",
          color: "#0C2548",
          mb: "24px",
        }}
      >
        Add New Businesses
      </Typography>

      {/* SECTION: BUSINESS DETAILS */}
      <Typography sx={sectionTitle}>Business details:</Typography>

      <Grid container columnSpacing={6}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={6}>
          {/* Business Name */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Business Name*</Typography>
            <TextField
              fullWidth
              size="small"
              name="businessName"
              placeholder="Business Name"
              onChange={handle}
              sx={input}
            />
          </Box>

          {/* Start Date */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Start Date:</Typography>
            <TextField
              fullWidth
              type="date"
              size="small"
              name="startDate"
              onChange={handle}
              sx={input}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {/* Upload Logo */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Upload Logo:</Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Upload File"
                sx={input}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InsertPhotoIcon
                        sx={{ fontSize: 18, color: "#6B7280" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                sx={{
                  background: "#1A73E8",
                  textTransform: "none",
                  borderRadius: "4px",
                  px: 3,
                  fontSize: "13px",
                }}
              >
                Browse
              </Button>
            </Box>
          </Box>

          {/* Business contact number */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Business contact number:</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Business contact number"
              name="contact"
              onChange={handle}
              sx={input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidIcon
                      sx={{ fontSize: 17, color: "#6B7280" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Country */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Country*</Typography>
            <TextField select fullWidth size="small" sx={input}>
              <MenuItem value="USA">USA</MenuItem>
              <MenuItem value="Canada">Canada</MenuItem>
              <MenuItem value="UK">UK</MenuItem>
            </TextField>
          </Box>

          {/* City */}
          <Box sx={fieldBox}>
            <Typography sx={label}>City*</Typography>
            <TextField fullWidth size="small" placeholder="City" sx={input} />
          </Box>

          {/* Landmark */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Landmark*</Typography>
            <TextField fullWidth size="small" placeholder="Landmark" sx={input} />
          </Box>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={6}>
          {/* Currency */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Currency*</Typography>
            <TextField
              select
              fullWidth
              size="small"
              name="currency"
              onChange={handle}
              sx={input}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </TextField>
          </Box>

          {/* Website */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Website:</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Website"
              name="website"
              onChange={handle}
              sx={input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PublicIcon sx={{ fontSize: 17, color: "#6B7280" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Alternate contact number */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Alternate contact number:</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Alternate number"
              sx={input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidIcon sx={{ fontSize: 17, color: "#6B7280" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* State */}
          <Box sx={fieldBox}>
            <Typography sx={label}>State*</Typography>
            <TextField fullWidth size="small" placeholder="State" sx={input} />
          </Box>

          {/* Zip Code */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Zip Code*</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Zip / Postal Code"
              sx={input}
            />
          </Box>

          {/* Time zone */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Time zone*</Typography>
            <TextField select fullWidth size="small" sx={input}>
              <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="EST">EST</MenuItem>
            </TextField>
          </Box>
        </Grid>
      </Grid>

      {/* OWNER INFORMATION SECTION */}
<Typography sx={sectionTitle}>Owner information</Typography>

<Grid container spacing={3}>

  {/* Prefix */}
  <Grid item xs={12} sm={4}>
    <Typography sx={label}>Prefix:</Typography>
    <TextField
      select
      fullWidth
      size="small"
      sx={input}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AlternateEmailIcon sx={{ fontSize: 16, color: "#6B7280" }} />
          </InputAdornment>
        ),
      }}
    >
      <MenuItem value="Mr">Mr</MenuItem>
      <MenuItem value="Mrs">Mrs</MenuItem>
      <MenuItem value="Miss">Miss</MenuItem>
    </TextField>
  </Grid>

  {/* First Name */}
  <Grid item xs={12} sm={4}>
    <Typography sx={label}>First Name*:</Typography>
    <TextField
      fullWidth
      size="small"
      placeholder="First Name"
      sx={input}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AlternateEmailIcon sx={{ fontSize: 16, color: "#6B7280" }} />
          </InputAdornment>
        ),
      }}
    />
  </Grid>

  {/* Last Name */}
  <Grid item xs={12} sm={4}>
    <Typography sx={label}>Last Name*:</Typography>
    <TextField
      fullWidth
      size="small"
      placeholder="Last Name"
      sx={input}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AlternateEmailIcon sx={{ fontSize: 16, color: "#6B7280" }} />
          </InputAdornment>
        ),
      }}
    />
  </Grid>

  {/* Username */}
  <Grid item xs={12} sm={6}>
    <Typography sx={label}>Username*:</Typography>
    <TextField
      fullWidth
      size="small"
      placeholder="Username"
      sx={input}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AlternateEmailIcon sx={{ fontSize: 16, color: "#6B7280" }} />
          </InputAdornment>
        ),
      }}
    />
  </Grid>

  {/* Email */}
  <Grid item xs={12} sm={6}>
    <Typography sx={label}>Email*:</Typography>
    <TextField
      fullWidth
      size="small"
      type="email"
      placeholder="Email"
      sx={input}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AlternateEmailIcon sx={{ fontSize: 16, color: "#6B7280" }} />
          </InputAdornment>
        ),
      }}
    />
  </Grid>

  {/* Password */}
  <Grid item xs={12} sm={6}>
    <Typography sx={label}>Password*:</Typography>
    <TextField
      fullWidth
      size="small"
      type="password"
      placeholder="Password"
      sx={input}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AlternateEmailIcon sx={{ fontSize: 16, color: "#6B7280" }} />
          </InputAdornment>
        ),
      }}
    />
  </Grid>

  {/* Confirm Password */}
  <Grid item xs={12} sm={6}>
    <Typography sx={label}>Confirm Password*:</Typography>
    <TextField
      fullWidth
      size="small"
      type="password"
      placeholder="Confirm Password"
      sx={input}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AlternateEmailIcon sx={{ fontSize: 16, color: "#6B7280" }} />
          </InputAdornment>
        ),
      }}
    />
  </Grid>
</Grid>

      {/* PACKAGES SECTION */}
      <Grid container columnSpacing={6} sx={{ mt: "28px" }}>
        <Grid item xs={12} md={4}>
          <Typography sx={label}>Packages:</Typography>
          <TextField select fullWidth size="small" sx={input}>
            <MenuItem value="Starter">Starter</MenuItem>
            <MenuItem value="Regular">Regular</MenuItem>
            <MenuItem value="Unlimited">Unlimited</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography sx={label}>Paid Via:</Typography>
          <TextField select fullWidth size="small" sx={input}>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Bank">Bank</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography sx={label}>Payment Transaction ID:</Typography>
          <TextField fullWidth size="small" sx={input} />
        </Grid>
      </Grid>

      {/* SUBMIT BUTTON */}
      <Box sx={{ textAlign: "center", mt: "40px" }}>
        <Button
          variant="contained"
          sx={{
            background: "#2ECC71",
            textTransform: "none",
            px: "38px",
            height: "40px",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "15px",
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}

/* ---- STYLES ---- */

const label = {
  fontWeight: 600,
  fontSize: "13.5px",
  color: "#0C2548",
  mb: "6px",
};

const input = {
  "& .MuiOutlinedInput-root": {
    height: "40px",
    borderRadius: "6px",
  },
};

const fieldBox = { mb: "24px" };

const sectionTitle = {
  fontWeight: 700,
  fontSize: "15px",
  color: "#0C2548",
  mt: "24px",
  mb: "12px",
};
