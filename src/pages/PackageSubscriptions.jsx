// src/pages/PackageSubscription.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Tooltip,
  InputAdornment,
  IconButton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const LABEL = {
  fontWeight: 600,
  fontSize: "14px",
  color: "#0C2548",
  mb: "6px",
};

const CAPTION = {
  fontSize: "12px",
  color: "#6B7280",
  mt: "4px",
};

export default function PackageSubscription() {
  const [data, setData] = useState({});
  const handle = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <Box
      sx={{
        px: "40px",
        py: "32px",
        maxWidth: "1120px",
      }}
    >
      {/* HEADER */}
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: "6px", color: "#0C2548", fontSize: "24px" }}
      >
        Packages{" "}
        <Typography component="span" sx={{ color: "#6B7280", fontSize: "15px" }}>
          All New Package
        </Typography>
      </Typography>

      {/* FORM GRID */}
      <Grid
        container
        spacing={"56px"} // EXACT Figma column gap
        sx={{ mt: "24px" }}
      >
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={6}>
          {/* Name */}
          <Box sx={{ mb: "26px" }}>
            <Typography sx={LABEL}>Name:</Typography>
            <TextField
              fullWidth
              size="small"
              name="name"
              onChange={handle}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "6px",
                },
              }}
            />
          </Box>

          {/* Number of Locations */}
          <Box sx={{ mb: "26px" }}>
            <Typography sx={LABEL}>Number of Locations:</Typography>
            <TextField
              fullWidth
              size="small"
              name="locations"
              placeholder="0 = infinite"
              onChange={handle}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "6px",
                },
              }}
            />
            <Typography sx={CAPTION}>0 = infinite</Typography>
          </Box>

          {/* Number of Cameras */}
          <Box sx={{ mb: "26px" }}>
            <Typography sx={LABEL}>Number of Cameras:</Typography>
            <TextField
              fullWidth
              size="small"
              name="cameras"
              placeholder="0 = infinite"
              onChange={handle}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "6px",
                },
              }}
            />
            <Typography sx={CAPTION}>0 = infinite</Typography>
          </Box>

          {/* Price Interval */}
          <Box sx={{ mb: "26px" }}>
            <Typography sx={LABEL}>Price Interval:</Typography>
            <TextField
              select
              fullWidth
              size="small"
              SelectProps={{ native: true }}
              name="priceInterval"
              onChange={handle}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "6px",
                },
              }}
            >
              <option value="">Please Select</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Annually">Annually</option>
            </TextField>
            <Typography sx={CAPTION}>Please Select</Typography>
          </Box>

          {/* Trial Days */}
          <Box sx={{ mb: "26px" }}>
            <Typography sx={LABEL}>Trial Days:</Typography>
            <TextField
              fullWidth
              size="small"
              name="trialDays"
              onChange={handle}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "6px",
                },
              }}
            />
          </Box>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={6}>
          {/* Description */}
          <Box sx={{ mb: "26px" }}>
            <Typography sx={LABEL}>Package Description:</Typography>
            <TextField
              fullWidth
              size="small"
              name="description"
              onChange={handle}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "6px",
                },
              }}
            />
          </Box>

          {/* Active Users */}
          <Box sx={{ mb: "26px" }}>
            <Typography sx={LABEL}>Number of active users:</Typography>
            <TextField
              fullWidth
              size="small"
              name="activeUsers"
              placeholder="0 = infinite"
              onChange={handle}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "6px",
                },
              }}
            />
            <Typography sx={CAPTION}>0 = infinite</Typography>
          </Box>

          {/* Invoices */}
          <Box sx={{ mb: "26px" }}>
            <Typography sx={LABEL}>Number of Invoices:</Typography>
            <TextField
              fullWidth
              size="small"
              name="invoices"
              placeholder="0 = infinite"
              onChange={handle}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "6px",
                },
              }}
            />
            <Typography sx={CAPTION}>0 = infinite</Typography>
          </Box>

          {/* Interval */}
          <Box sx={{ mb: "26px" }}>
            <Typography sx={LABEL}>Interval:</Typography>
            <TextField
              fullWidth
              size="small"
              name="interval"
              onChange={handle}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "6px",
                },
              }}
            />
          </Box>

          {/* Price */}
          <Box sx={{ mb: "26px" }}>
            <Typography
              sx={{
                ...LABEL,
                display: "flex",
                alignItems: "center",
              }}
            >
              Price:
              <Tooltip title="Enter 0 for free" placement="top">
                <IconButton size="small" sx={{ ml: "4px" }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>

            <TextField
              fullWidth
              size="small"
              name="price"
              onChange={handle}
              placeholder="USD $"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">USD $</InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  borderRadius: "6px",
                },
              }}
            />

            <Typography sx={CAPTION}>0 = Free Package</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* SAVE BUTTON */}
      <Box sx={{ mt: "40px", textAlign: "right" }}>
        <Button
          variant="contained"
          sx={{
            background: "#0C2548",
            borderRadius: "8px",
            width: "90px",
            height: "40px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
