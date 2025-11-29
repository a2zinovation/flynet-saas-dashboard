// src/pages/AddBusiness.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PublicIcon from "@mui/icons-material/Public";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import businessService from "../services/businessService";
import packageService from "../services/packageService";

export default function AddBusiness() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    domain: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    subscription_package_id: "",
  });
  const [logo, setLogo] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const result = await packageService.getAll();
    if (result.success) {
      setPackages(result.data);
    }
  };

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("domain", form.domain || form.name.toLowerCase().replace(/\s+/g, "-"));
    formData.append("owner", form.owner);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("website", form.website);
    formData.append("subscription_package_id", form.subscription_package_id);
    
    if (logo) {
      formData.append("logo", logo);
    }

    const result = await businessService.create(formData);

    if (result.success) {
      setSuccess("Business created successfully!");
      setTimeout(() => {
        navigate("/all-business");
      }, 2000);
    } else {
      setError(result.message || "Failed to create business");
    }

    setLoading(false);
  };

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

      <form onSubmit={handleSubmit}>
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
              name="name"
              value={form.name}
              placeholder="Business Name"
              onChange={handle}
              sx={input}
              required
              disabled={loading}
            />
          </Box>

          {/* Domain */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Domain:</Typography>
            <TextField
              fullWidth
              size="small"
              name="domain"
              value={form.domain}
              placeholder="business-domain"
              onChange={handle}
              sx={input}
              disabled={loading}
            />
          </Box>

          {/* Upload Logo */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Upload Logo:</Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={logo ? logo.name : "Upload File"}
                sx={input}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InsertPhotoIcon
                        sx={{ fontSize: 18, color: "#6B7280" }}
                      />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
              />

              <Button
                variant="contained"
                component="label"
                disabled={loading}
                sx={{
                  background: "#1A73E8",
                  textTransform: "none",
                  borderRadius: "4px",
                  px: 3,
                  fontSize: "13px",
                }}
              >
                Browse
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </Button>
            </Box>
          </Box>

          {/* Business contact number */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Business contact number*:</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Business contact number"
              name="phone"
              value={form.phone}
              onChange={handle}
              sx={input}
              required
              disabled={loading}
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

          {/* Owner */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Owner Name*:</Typography>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Owner Name"
              name="owner"
              value={form.owner}
              onChange={handle}
              sx={input}
              required
              disabled={loading}
            />
          </Box>

          {/* Email */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Business Email*:</Typography>
            <TextField 
              fullWidth 
              size="small" 
              type="email"
              placeholder="business@example.com"
              name="email"
              value={form.email}
              onChange={handle}
              sx={input}
              required
              disabled={loading}
            />
          </Box>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={6}>
          {/* Website */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Website:</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="https://example.com"
              name="website"
              value={form.website}
              onChange={handle}
              sx={input}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PublicIcon sx={{ fontSize: 17, color: "#6B7280" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Address */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Business Address*:</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="123 Main St, City, State, Country"
              name="address"
              value={form.address}
              onChange={handle}
              sx={input}
              required
              disabled={loading}
              multiline
              rows={3}
            />
          </Box>

          {/* Package Selection */}
          <Box sx={fieldBox}>
            <Typography sx={label}>Subscription Package*:</Typography>
            <TextField
              select
              fullWidth
              size="small"
              name="subscription_package_id"
              value={form.subscription_package_id}
              onChange={handle}
              sx={input}
              required
              disabled={loading}
            >
              <MenuItem value="">Select Package</MenuItem>
              {packages.map((pkg) => (
                <MenuItem key={pkg.id} value={pkg.id}>
                  {pkg.name} - ${pkg.price}/{pkg.duration_type}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Grid>
      </Grid>

      {/* SUBMIT BUTTON */}
      <Box sx={{ textAlign: "center", mt: "40px", display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="outlined"
          disabled={loading}
          onClick={() => navigate("/all-business")}
          sx={{
            textTransform: "none",
            px: "38px",
            height: "40px",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "15px",
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </Box>
      </form>
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
