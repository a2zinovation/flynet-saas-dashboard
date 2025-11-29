// src/pages/EditBusiness.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PublicIcon from "@mui/icons-material/Public";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import businessService from "../services/businessService";
import packageService from "../services/packageService";

export default function EditBusiness() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [form, setForm] = useState({
    id: "",
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
  const [currentLogo, setCurrentLogo] = useState("");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPackages();
    fetchBusiness();
  }, [id]);

  const fetchPackages = async () => {
    const result = await packageService.getAll();
    if (result.success) {
      setPackages(result.data);
    }
  };

  const fetchBusiness = async () => {
    setLoading(true);
    const result = await businessService.getById(id);
    
    if (result.success) {
      const business = result.data;
      setForm({
        id: business.id,
        name: business.name || "",
        domain: business.domain || "",
        owner: business.owner || "",
        email: business.email || "",
        phone: business.phone || "",
        address: business.address || "",
        website: business.website || "",
        subscription_package_id: business.subscription_package_id || "",
      });
      setCurrentLogo(business.logo || "");
    } else {
      setError(result.message || "Failed to load business");
    }
    setLoading(false);
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
    setSaving(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("id", form.id);
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

    const result = await businessService.update(formData);

    if (result.success) {
      setSuccess("Business updated successfully!");
      setTimeout(() => {
        navigate("/all-business");
      }, 2000);
    } else {
      setError(result.message || "Failed to update business");
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
        Edit Business
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
                disabled={saving}
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
                disabled={saving}
              />
            </Box>

            {/* Upload Logo */}
            <Box sx={fieldBox}>
              <Typography sx={label}>Upload Logo:</Typography>
              
              {currentLogo && !logo && (
                <Box sx={{ mb: 1 }}>
                  <img 
                    src={currentLogo} 
                    alt="Current Logo" 
                    style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
                  />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Current Logo
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={logo ? logo.name : "Upload New File"}
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
                  disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
                SelectProps={{ native: true }}
              >
                <option value="">Select Package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - ${pkg.price}/{pkg.duration_type}
                  </option>
                ))}
              </TextField>
            </Box>
          </Grid>
        </Grid>

        {/* SUBMIT BUTTON */}
        <Box sx={{ textAlign: "center", mt: "40px", display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="outlined"
            disabled={saving}
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
            disabled={saving}
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
            {saving ? <CircularProgress size={24} color="inherit" /> : "Update"}
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
