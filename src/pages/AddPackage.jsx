// src/pages/AddPackage.jsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";

export default function AddPackage() {
  return (
    <Box>
      {/* Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Packages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add New Package
        </Typography>
      </Box>

      {/* FORM CARD */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid #E8EDF2",
        }}
      >
        <Grid container spacing={3}>
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Name:
            </Typography>
            <TextField fullWidth size="small" />

            <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
              Number of Locations:
            </Typography>
            <TextField fullWidth size="small" />

            <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
              Number of Cameras:
            </Typography>
            <TextField fullWidth size="small" />

            <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
              Price Interval:
            </Typography>
            <FormControl fullWidth size="small">
              <Select defaultValue="">
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>

            <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
              Trial Days:
            </Typography>
            <TextField fullWidth size="small" />
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Package Description:
            </Typography>
            <TextField fullWidth size="small" />

            <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
              Number of active users:
            </Typography>
            <TextField fullWidth size="small" />

            <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
              Number of Invoices:
            </Typography>
            <TextField fullWidth size="small" />

            <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
              Interval:
            </Typography>
            <TextField fullWidth size="small" />

            <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
              Price:
            </Typography>
            <TextField
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <Typography sx={{ mr: 1, fontWeight: 600 }}>USD $</Typography>
                ),
              }}
            />

            {/* Free package toggle */}
            <RadioGroup defaultValue="paid" sx={{ mt: 1 }}>
              <FormControlLabel
                value="free"
                control={<Radio />}
                label="Free Package"
              />
            </RadioGroup>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0C2548",
              borderRadius: 2,
              textTransform: "none",
              px: 4,
            }}
          >
            Save
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
