// src/pages/EditBusiness.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
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
import settingsService from "../services/settingsService";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

export default function EditBusiness() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [form, setForm] = useState({
    id: "",
    // Business Details
    name: "",
    start_date: "",
    phone: "",
    alternate_phone: "",
    country: "",
    state: "",
    city: "",
    zip_code: "",
    landmark: "",
    timezone: "",
    currency: "",
    website: "",
    
    // Owner Information
    prefix: "",
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    
    // Package Information
    subscription_package_id: "",
    paid_via: "",
    payment_transaction_id: "",
  });
  const [logo, setLogo] = useState(null);
  const [currentLogo, setCurrentLogo] = useState("");
  const [packages, setPackages] = useState([]);
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPackages();
    fetchPaymentGateways();
    fetchBusiness();
  }, [id]);

  const fetchPackages = async () => {
    const result = await packageService.getAll();
    if (result.success) {
      setPackages(result.data);
    }
  };

  const fetchPaymentGateways = async () => {
    const result = await settingsService.getPaymentGateways();
    if (result.success) {
      // Filter only active gateways
      const activeGateways = result.data.filter(gw => gw.is_active);
      setPaymentGateways(activeGateways);
    }
  };

  const fetchBusiness = async () => {
    setLoading(true);
    const result = await businessService.getById(id);
    
    if (result.success) {
      const business = result.data;
      setForm({
        id: business.id,
        // Business Details
        name: business.name || "",
        start_date: business.start_date ? business.start_date.split('T')[0] : "",
        phone: business.phone || "",
        alternate_phone: business.alternate_phone || "",
        country: business.country || "",
        state: business.state || "",
        city: business.city || "",
        zip_code: business.zip_code || "",
        landmark: business.landmark || "",
        timezone: business.timezone || "",
        currency: business.currency || "",
        website: business.website || "",
        
        // Owner Information
        prefix: business?.users[0]?.prefix || "",
        first_name: business?.users[0]?.first_name || "",
        last_name: business?.users[0]?.last_name || "",
        username: business?.users[0]?.username || "",
        email: business.email || "",
        
        // Package Information
        subscription_package_id: business.subscription_package_id || "",
        paid_via: business.paid_via || "",
        payment_transaction_id: business.payment_transaction_id || "",
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
    
    // Business Details
    formData.append("name", form.name);
    formData.append("domain", form.name.toLowerCase().replace(/\s+/g, "-"));
    formData.append("start_date", form.start_date);
    formData.append("phone", form.phone);
    formData.append("alternate_phone", form.alternate_phone);
    formData.append("country", form.country);
    formData.append("state", form.state);
    formData.append("city", form.city);
    formData.append("zip_code", form.zip_code);
    formData.append("landmark", form.landmark);
    formData.append("timezone", form.timezone);
    formData.append("currency", form.currency);
    formData.append("website", form.website);
    
    // Owner Information
    formData.append("prefix", form.prefix);
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("username", form.username);
    formData.append("email", form.email);
    
    // Package Information
    formData.append("subscription_package_id", form.subscription_package_id);
    formData.append("paid_via", form.paid_via);
    formData.append("payment_transaction_id", form.payment_transaction_id);
    
    // Logo
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

            {/* Start Date */}
            <Box sx={fieldBox}>
              <Typography sx={label}>Start Date:</Typography>
              <TextField
                fullWidth
                type="date"
                size="small"
                name="start_date"
                value={form.start_date}
                onChange={handle}
                sx={input}
                disabled={saving}
                InputLabelProps={{ shrink: true }}
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

            {/* Country */}
            <Box sx={fieldBox}>
              <Typography sx={label}>Country*</Typography>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Country"
                name="country"
                value={form.country}
                onChange={handle}
                sx={input}
                required
                disabled={saving}
              />
            </Box>

            {/* City */}
            <Box sx={fieldBox}>
              <Typography sx={label}>City*</Typography>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="City" 
                name="city"
                value={form.city}
                onChange={handle}
                sx={input}
                required
                disabled={saving}
              />
            </Box>

            {/* Landmark */}
            <Box sx={fieldBox}>
              <Typography sx={label}>Landmark*</Typography>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Landmark" 
                name="landmark"
                value={form.landmark}
                onChange={handle}
                sx={input}
                required
                disabled={saving}
              />
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
                value={form.currency}
                onChange={handle}
                sx={input}
                required
                disabled={saving}
              >
                <MenuItem value="">Select Currency</MenuItem>
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

            {/* Alternate contact number */}
            <Box sx={fieldBox}>
              <Typography sx={label}>Alternate contact number:</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Alternate number"
                name="alternate_phone"
                value={form.alternate_phone}
                onChange={handle}
                sx={input}
                disabled={saving}
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
              <TextField 
                fullWidth 
                size="small" 
                placeholder="State" 
                name="state"
                value={form.state}
                onChange={handle}
                sx={input}
                required
                disabled={saving}
              />
            </Box>

            {/* Zip Code */}
            <Box sx={fieldBox}>
              <Typography sx={label}>Zip Code*</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Zip / Postal Code"
                name="zip_code"
                value={form.zip_code}
                onChange={handle}
                sx={input}
                required
                disabled={saving}
              />
            </Box>

            {/* Time zone */}
            <Box sx={fieldBox}>
              <Typography sx={label}>Time zone*</Typography>
              <TextField 
                select 
                fullWidth 
                size="small" 
                name="timezone"
                value={form.timezone}
                onChange={handle}
                sx={input}
                required
                disabled={saving}
              >
                <MenuItem value="">Select Timezone</MenuItem>
                <MenuItem value="Asia/Karachi">Asia/Karachi (PKT)</MenuItem>
                <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                <MenuItem value="America/Los_Angeles">America/Los_Angeles (PST)</MenuItem>
                <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                <MenuItem value="UTC">UTC</MenuItem>
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
              name="prefix"
              value={form.prefix}
              onChange={handle}
              sx={input}
              disabled={saving}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailIcon sx={{ fontSize: 16, color: "#6B7280" }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Mr">Mr</MenuItem>
              <MenuItem value="Mrs">Mrs</MenuItem>
              <MenuItem value="Miss">Miss</MenuItem>
              <MenuItem value="Dr">Dr</MenuItem>
            </TextField>
          </Grid>

          {/* First Name */}
          <Grid item xs={12} sm={4}>
            <Typography sx={label}>First Name*:</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="First Name"
              name="first_name"
              value={form.first_name}
              onChange={handle}
              sx={input}
              required
              disabled={saving}
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
              name="last_name"
              value={form.last_name}
              onChange={handle}
              sx={input}
              required
              disabled={saving}
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
              name="username"
              value={form.username}
              onChange={handle}
              sx={input}
              required
              disabled={saving}
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
              placeholder="owner@example.com"
              name="email"
              value={form.email}
              onChange={handle}
              sx={input}
              required
              disabled={saving}
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
        <Typography sx={sectionTitle}>Package & Payment Information</Typography>
        
        <Grid container columnSpacing={6}>
          <Grid item xs={12} md={4}>
            <Typography sx={label}>Packages*:</Typography>
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
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography sx={label}>Payment Gateway:</Typography>
            <TextField 
              select 
              fullWidth 
              size="small" 
              name="paid_via"
              value={form.paid_via}
              onChange={handle}
              sx={input}
              disabled={saving}
            >
              <MenuItem value="">Select Payment Gateway</MenuItem>
              {paymentGateways.map((gateway) => (
                <MenuItem key={gateway.id} value={gateway.name}>
                  {gateway.name}
                </MenuItem>
              ))}
            </TextField>
            {paymentGateways.length === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                No payment gateways configured. Configure in Settings.
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography sx={label}>Payment Transaction ID:</Typography>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Transaction ID"
              name="payment_transaction_id"
              value={form.payment_transaction_id}
              onChange={handle}
              sx={input}
              disabled={saving}
            />
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
