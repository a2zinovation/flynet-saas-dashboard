// src/pages/AddPackage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import packageService from "../services/packageService";
import settingsService from "../services/settingsService";

export default function AddPackage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    is_free: false,
    price_interval: "monthly",
    interval: "",
    trial_days: "",
    max_cameras: "",
    max_locations: "",
    max_users: "",
    payment_gateway_id: "",
    analytics_enabled: false,
    api_access_enabled: false,
    recording_enabled: true,
    motion_detection_enabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentGateways, setPaymentGateways] = useState([]);

  // Fetch payment gateways on mount
  useEffect(() => {
    fetchPaymentGateways();
  }, []);

  const fetchPaymentGateways = async () => {
    const result = await settingsService.getPaymentGateways();
    if (result.success) {
      // Filter only active gateways
      const activeGateways = result.data.filter(gw => gw.is_active);
      setPaymentGateways(activeGateways);
    }
  };

  const handle = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setForm({ ...form, [name]: checked });
  };

  const handlePackageTypeChange = (e) => {
    const isFree = e.target.value === "free";
    setForm({ ...form, is_free: isFree, price: isFree ? "0" : form.price });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Prepare data for API
    const packageData = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      price_interval: form.price_interval,
      interval: parseInt(form.interval) || 1,
      trial_days: parseInt(form.trial_days) || 0,
      max_cameras: parseInt(form.max_cameras) || 0,
      max_locations: parseInt(form.max_locations) || 0,
      max_users: parseInt(form.max_users) || 0,
      payment_gateway_id: form.payment_gateway_id || null,
      analytics_enabled: form.analytics_enabled ? 1 : 0,
      api_access_enabled: form.api_access_enabled ? 1 : 0,
      recording_enabled: form.recording_enabled ? 1 : 0,
      motion_detection_enabled: form.motion_detection_enabled ? 1 : 0,
    };

    const result = await packageService.create(packageData);

    if (result.success) {
      setSuccess("Package created successfully!");
      setTimeout(() => {
        navigate("/packages");
      }, 2000);
    } else {
      setError(result.message || "Failed to create package");
    }

    setLoading(false);
  };

  return (
    <Box>
      {/* Title */}
      <Box sx={{ mb: 3, flexGrow: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          Packages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add New Package
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* FORM CARD */}
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
            {/* LEFT COLUMN */}
            <Grid item xs={12} md={6} sx={{ flexGrow: 1 }}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                Name:
              </Typography>
              <TextField 
                fullWidth 
                size="small"
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="Enter package name"
                required
                disabled={loading}
              />

              {/* <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Number of Locations:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="max_locations"
                type="number"
                value={form.max_locations}
                onChange={handle}
                placeholder="0 = infinite"
                disabled={loading}
                inputProps={{ min: 0 }}
              /> */}

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Number of Cameras:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="max_cameras"
                type="number"
                value={form.max_cameras}
                onChange={handle}
                placeholder="0 = infinite"
                disabled={loading}
                inputProps={{ min: 0 }}
              />

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Price Interval:
              </Typography>
              <FormControl fullWidth size="small" disabled={loading}>
                <Select
                  name="price_interval"
                  value={form.price_interval}
                  onChange={handle}
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Trial Days:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="trial_days"
                type="number"
                value={form.trial_days}
                onChange={handle}
                placeholder="0"
                disabled={loading}
                inputProps={{ min: 0 }}
              />

              {/* <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Payment Gateway:
              </Typography>
              <FormControl fullWidth size="small" disabled={loading || form.is_free}>
                <Select
                  name="payment_gateway_id"
                  value={form.payment_gateway_id}
                  onChange={handle}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Payment Gateway</em>
                  </MenuItem>
                  {paymentGateways.map((gateway) => (
                    <MenuItem key={gateway.id} value={gateway.id}>
                      {gateway.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {paymentGateways.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  No active payment gateways. Configure in Settings.
                </Typography>
              )} */}
            </Grid>

            {/* RIGHT COLUMN */}
            <Grid item xs={12} md={6} sx={{ flexGrow: 1 }}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                Package Description:
              </Typography>
              <TextField 
                fullWidth 
                size="small"
                name="description"
                value={form.description}
                onChange={handle}
                placeholder="Brief description"
                disabled={loading}
              />

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Number of active users:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="max_users"
                type="number"
                value={form.max_users}
                onChange={handle}
                placeholder="0 = infinite"
                disabled={loading}
                inputProps={{ min: 0 }}
              />

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Interval:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="interval"
                type="number"
                value={form.interval}
                onChange={handle}
                placeholder="1"
                disabled={loading}
                inputProps={{ min: 1 }}
              />

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Package Type:
              </Typography>
              <FormControl fullWidth size="small" disabled={loading}>
                <Select
                  name="package_type"
                  value={form.is_free ? "free" : "paid"}
                  onChange={handlePackageTypeChange}
                >
                  <MenuItem value="paid">Paid Package</MenuItem>
                  <MenuItem value="free">Free Package</MenuItem>
                </Select>
              </FormControl>

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Price:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="price"
                type="number"
                value={form.price}
                onChange={handle}
                placeholder="0"
                disabled={loading || form.is_free}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontWeight: 600 }}>USD $</Typography>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, step: "0.01" }}
              />
              {form.is_free && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  Price is disabled for free packages
                </Typography>
              )}
            </Grid>

            {/* FEATURE TOGGLES - Full Width */}
            {/* <Grid item xs={12}>
              <Typography fontWeight={600} sx={{ mb: 2, mt: 2 }}>
                Features:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.analytics_enabled}
                        onChange={handleCheckbox}
                        name="analytics_enabled"
                        disabled={loading}
                      />
                    }
                    label="Analytics Enabled"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.api_access_enabled}
                        onChange={handleCheckbox}
                        name="api_access_enabled"
                        disabled={loading}
                      />
                    }
                    label="API Access Enabled"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.recording_enabled}
                        onChange={handleCheckbox}
                        name="recording_enabled"
                        disabled={loading}
                      />
                    }
                    label="Recording Enabled"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.motion_detection_enabled}
                        onChange={handleCheckbox}
                        name="motion_detection_enabled"
                        disabled={loading}
                      />
                    }
                    label="Motion Detection"
                  />
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>

          {/* Save Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/packages")}
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 4,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#0C2548",
                borderRadius: 2,
                textTransform: "none",
                px: 4,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Package"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
