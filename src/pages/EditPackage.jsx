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
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import packageService from "../services/packageService";

export default function EditPackage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    duration_type: "month",
    max_cameras: 10,
    max_locations: 5,
    max_users: 10,
    analytics_enabled: false,
    api_access_enabled: false,
    recording_enabled: true,
    motion_detection_enabled: true,
    features: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPackage();
  }, [id]);

  const fetchPackage = async () => {
    setLoading(true);
    const result = await packageService.getById(id);
    
    if (result.success) {
      const pkg = result.data;
      setForm({
        id: pkg.id,
        name: pkg.name || "",
        description: pkg.description || "",
        price: pkg.price || "",
        duration_type: pkg.duration_type || "month",
        max_cameras: pkg.max_cameras || 10,
        max_locations: pkg.max_locations || 5,
        max_users: pkg.max_users || 10,
        analytics_enabled: pkg.analytics_enabled === 1 || pkg.analytics_enabled === true,
        api_access_enabled: pkg.api_access_enabled === 1 || pkg.api_access_enabled === true,
        recording_enabled: pkg.recording_enabled === 1 || pkg.recording_enabled === true,
        motion_detection_enabled: pkg.motion_detection_enabled === 1 || pkg.motion_detection_enabled === true,
        features: pkg.features?.map(f => f.id) || [],
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
      duration_type: form.duration_type,
      max_cameras: parseInt(form.max_cameras) || 10,
      max_locations: parseInt(form.max_locations) || 5,
      max_users: parseInt(form.max_users) || 10,
      analytics_enabled: form.analytics_enabled ? 1 : 0,
      api_access_enabled: form.api_access_enabled ? 1 : 0,
      recording_enabled: form.recording_enabled ? 1 : 0,
      motion_detection_enabled: form.motion_detection_enabled ? 1 : 0,
      features: form.features,
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
            <Grid item xs={12} md={6}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                Package Name*:
              </Typography>
              <TextField 
                fullWidth 
                size="small"
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="e.g., Premium Package"
                required
                disabled={saving}
              />

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Package Description*:
              </Typography>
              <TextField 
                fullWidth 
                size="small"
                name="description"
                value={form.description}
                onChange={handle}
                placeholder="Brief description of package"
                required
                disabled={saving}
                multiline
                rows={3}
              />

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Price*:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="price"
                type="number"
                value={form.price}
                onChange={handle}
                placeholder="0"
                required
                disabled={saving}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">USD $</InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Enter 0 for free package
              </Typography>
            </Grid>

            {/* RIGHT COLUMN */}
            <Grid item xs={12} md={6}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                Duration Type*:
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="duration_type"
                value={form.duration_type}
                onChange={handle}
                required
                disabled={saving}
              >
                <MenuItem value="day">Daily</MenuItem>
                <MenuItem value="week">Weekly</MenuItem>
                <MenuItem value="month">Monthly</MenuItem>
                <MenuItem value="year">Yearly</MenuItem>
              </TextField>

              {/* <Box sx={{ mt: 3, p: 2, bgcolor: "#F9FAFB", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Package ID:</strong> {form.id}
                </Typography>
              </Box> */}
            </Grid>

            {/* PACKAGE LIMITS SECTION */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Package Limits
              </Typography>
            </Grid>

            {/* Limits - Left Column */}
            <Grid item xs={12} md={6}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                Max Cameras*:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="max_cameras"
                type="number"
                value={form.max_cameras}
                onChange={handle}
                required
                disabled={saving}
                inputProps={{ min: 0 }}
              />

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Max Locations*:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="max_locations"
                type="number"
                value={form.max_locations}
                onChange={handle}
                required
                disabled={saving}
                inputProps={{ min: 0 }}
              />

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Max Users*:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="max_users"
                type="number"
                value={form.max_users}
                onChange={handle}
                required
                disabled={saving}
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* Feature Toggles - Right Column */}
            <Grid item xs={12} md={6}>
              <Typography fontWeight={600} sx={{ mb: 2 }}>
                Features:
              </Typography>
              
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
                sx={{ display: 'block' }}
              />

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
                sx={{ display: 'block' }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.motion_detection_enabled}
                    onChange={handleCheckbox}
                    name="motion_detection_enabled"
                    disabled={saving}
                  />
                }
                label="Motion Detection Enabled"
                sx={{ display: 'block' }}
              />
            </Grid>
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
