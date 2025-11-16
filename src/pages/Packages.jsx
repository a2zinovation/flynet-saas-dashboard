// src/pages/Packages.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
  MenuItem,
  Button,
} from "@mui/material";

export default function AddPackage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    locations: "",
    activeUsers: "",
    cameras: "",
    invoices: "",
    priceInterval: "",
    interval: "",
    price: "",
    trialDays: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box>
      {/* PAGE TITLE */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Packages
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        All New Package
      </Typography>

      {/* FORM WRAPPER */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: "1px solid #E5E9F2",
        }}
      >
        <Stack direction="row" spacing={4}>
          {/* LEFT COLUMN */}
          <Box flex={1}>
            <Typography fontWeight={600} fontSize={13} sx={{ mb: 1 }}>
              Name:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography fontWeight={600} fontSize={13} sx={{ mb: 1 }}>
              Number of Locations:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.locations}
              onChange={(e) => handleChange("locations", e.target.value)}
              sx={{ mb: 1 }}
            />
            <Typography fontSize={12} color="text.secondary" sx={{ mb: 3 }}>
              0 = Infinite
            </Typography>

            <Typography fontWeight={600} fontSize={13} sx={{ mb: 1 }}>
              Number of Cameras:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.cameras}
              onChange={(e) => handleChange("cameras", e.target.value)}
              sx={{ mb: 1 }}
            />
            <Typography fontSize={12} color="text.secondary" sx={{ mb: 3 }}>
              0 = Infinite
            </Typography>

            <Typography fontWeight={600} fontSize={13} sx={{ mb: 1 }}>
              Price Interval:
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={form.priceInterval}
              onChange={(e) => handleChange("priceInterval", e.target.value)}
              sx={{ mb: 3 }}
            >
              <MenuItem value="">Please Select</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </TextField>

            <Typography fontWeight={600} fontSize={13} sx={{ mb: 1 }}>
              Trial Days:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.trialDays}
              onChange={(e) => handleChange("trialDays", e.target.value)}
            />
          </Box>

          {/* RIGHT COLUMN */}
          <Box flex={1}>
            <Typography fontWeight={600} fontSize={13} sx={{ mb: 1 }}>
              Package Description:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography fontWeight={600} fontSize={13} sx={{ mb: 1 }}>
              Number of active users:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.activeUsers}
              onChange={(e) => handleChange("activeUsers", e.target.value)}
              sx={{ mb: 1 }}
            />
            <Typography fontSize={12} color="text.secondary" sx={{ mb: 3 }}>
              0 = Infinite
            </Typography>

            <Typography fontWeight={600} fontSize={13} sx={{ mb: 1 }}>
              Number of invoices:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.invoices}
              onChange={(e) => handleChange("invoices", e.target.value)}
              sx={{ mb: 1 }}
            />
            <Typography fontSize={12} color="text.secondary" sx={{ mb: 3 }}>
              0 = Infinite
            </Typography>

            <Typography fontWeight={600} fontSize={13} sx={{ mb: 1 }}>
              Interval:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.interval}
              onChange={(e) => handleChange("interval", e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography fontWeight={600} fontSize={13} sx={{ mb: 1 }}>
              Price:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
            <Typography fontSize={12} color="text.secondary" sx={{ mt: 1 }}>
              0 = Free Package
            </Typography>
          </Box>
        </Stack>

        {/* SAVE BUTTON */}
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0C2548",
              textTransform: "none",
              px: 4,
            }}
          >
            Save
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
