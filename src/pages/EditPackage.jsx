// src/pages/EditPackage.jsx
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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import packageService from "../services/packageService";
import settingsService from "../services/settingsService";

export default function EditPackage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    is_free: false,
    price_interval: "monthly",
    duration: "",
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentGateways, setPaymentGateways] = useState([]);

  useEffect(() => {
    fetchPackage();
    fetchPaymentGateways();
  }, [id]);

  const fetchPaymentGateways = async () => {
    const result = await settingsService.getPaymentGateways();
    if (result.success) {
      const activeGateways = result.data.filter(gw => gw.is_active);
      setPaymentGateways(activeGateways);
    }
  };

  const fetchPackage = async () => {
    setLoading(true);
    const result = await packageService.getById(id);
    
    if (result.success) {
      const pkg = result.data;
      const priceValue = parseFloat(pkg.price) || 0;
      const isFree = priceValue === 0;
      const priceInterval = pkg.price_interval;
      
      setForm({
        id: pkg.id,
        name: pkg.name || "",
        description: pkg.description || "",
        price: priceValue,
        is_free: isFree,
        price_interval: priceInterval,
        duration: pkg.duration || "",
        trial_days: pkg.trial_days || "",
        max_cameras: pkg.max_cameras || "",
        max_locations: pkg.max_locations || "",
        max_users: pkg.max_users || "",
        payment_gateway_id: pkg.payment_gateway_id || "",
        analytics_enabled: pkg.analytics_enabled === 1 || pkg.analytics_enabled === true,
        api_access_enabled: pkg.api_access_enabled === 1 || pkg.api_access_enabled === true,
        recording_enabled: pkg.recording_enabled === 1 || pkg.recording_enabled === true,
        motion_detection_enabled: pkg.motion_detection_enabled === 1 || pkg.motion_detection_enabled === true,
      });
    } else {
      setError(result.message || "Failed to load package");
    }
    setLoading(false);
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
    setSaving(true);
    setError("");
    setSuccess("");

    // Prepare data for API
    const packageData = {
      id: form.id,
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      price_interval: form.price_interval,
      duration: parseInt(form.duration) || 1,
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

    const result = await packageService.update(packageData);

    if (result.success) {
      setSuccess("Package updated successfully!");
      setTimeout(() => {
        navigate("/packages");
      }, 2000);
    } else {
      setError(result.message || "Failed to update package");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Packages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Edit Package
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
                inputProps={{ min: 0 }}
              />

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Price Interval:
              </Typography>
              <FormControl fullWidth size="small" disabled={saving}>
                <Select
                  name="price_interval"
                  value={form.price_interval}
                  onChange={handle}
                >
                  <MenuItem value="monthly">Month</MenuItem>
                  <MenuItem value="yearly">Year</MenuItem>
                </Select>
              </FormControl>

              {/* <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
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
                disabled={saving}
                inputProps={{ min: 0 }}
              /> */}

              {/* <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Payment Gateway:
              </Typography>
              <FormControl fullWidth size="small" disabled={saving || form.is_free}>
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
                disabled={saving}
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
                disabled={saving}
                inputProps={{ min: 0 }}
              />

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Interval:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="duration"
                type="number"
                value={form.duration}
                onChange={handle}
                placeholder="1"
                disabled={saving}
                inputProps={{ min: 1 }}
              />

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Package Type:
              </Typography>
              <FormControl fullWidth size="small" disabled={saving}>
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
                disabled={saving || form.is_free}
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
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
              sx={{
                backgroundColor: "#0C2548",
                borderRadius: 2,
                textTransform: "none",
                px: 4,
              }}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : "Update Package"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
