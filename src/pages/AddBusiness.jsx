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
import settingsService from "../services/settingsService";

export default function AddBusiness() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
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
    password: "",
    password_confirmation: "",
    
    // Package Information
    subscription_package_id: "",
    paid_via: "",
    payment_transaction_id: "",
  });
  const [logo, setLogo] = useState(null);
  const [packages, setPackages] = useState([]);
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPackages();
    fetchPaymentGateways();
  }, []);

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

  const handle = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Business name is required";
        else if (value.length < 2) error = "Business name must be at least 2 characters";
        else if (value.length > 100) error = "Business name must not exceed 100 characters";
        break;

      case "phone":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^\+?[\d\s\-()]{10,20}$/.test(value)) error = "Please enter a valid phone number";
        break;

      case "alternate_phone":
        if (value && !/^\+?[\d\s\-()]{10,20}$/.test(value)) error = "Please enter a valid phone number";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email address";
        break;

      case "website":
        if (value && !/^https?:\/\/.+\..+/.test(value)) error = "Please enter a valid URL (e.g., https://example.com)";
        break;

      case "country":
        if (!value.trim()) error = "Country is required";
        else if (value.length < 2) error = "Country name must be at least 2 characters";
        break;

      case "state":
        if (!value.trim()) error = "State is required";
        else if (value.length < 2) error = "State name must be at least 2 characters";
        break;

      case "city":
        if (!value.trim()) error = "City is required";
        else if (value.length < 2) error = "City name must be at least 2 characters";
        break;

      case "zip_code":
        if (!value.trim()) error = "Zip code is required";
        else if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(value)) error = "Please enter a valid zip code";
        break;

      case "landmark":
        if (!value.trim()) error = "Landmark is required";
        break;

      case "currency":
        if (!value) error = "Currency is required";
        break;

      case "first_name":
        if (!value.trim()) error = "First name is required";
        else if (!/^[a-zA-Z\s]{2,50}$/.test(value)) error = "First name must contain only letters (2-50 characters)";
        break;

      case "last_name":
        if (!value.trim()) error = "Last name is required";
        else if (!/^[a-zA-Z\s]{2,50}$/.test(value)) error = "Last name must contain only letters (2-50 characters)";
        break;

      case "username":
        if (!value.trim()) error = "Username is required";
        else if (!/^[a-zA-Z0-9_]{3,30}$/.test(value)) error = "Username must be 3-30 characters (letters, numbers, underscore only)";
        break;

      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8) error = "Password must be at least 8 characters";
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) error = "Password must contain uppercase, lowercase, and number";
        break;

      case "password_confirmation":
        if (!value) error = "Please confirm your password";
        else if (value !== form.password) error = "Passwords do not match";
        break;

      case "subscription_package_id":
        if (!value) error = "Please select a package";
        break;

      default:
        break;
    }

    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "name", "phone", "country", 
       "first_name", "last_name", "username", "email",
      "password", "password_confirmation", "subscription_package_id"
    ];

    requiredFields.forEach((field) => {
      const error = validateField(field, form[field]);
      console.log(error);
      
      if (error) {
        newErrors[field] = error;
      }
    });

    // Validate optional fields if they have values
    if (form.alternate_phone) {
      const error = validateField("alternate_phone", form.alternate_phone);
      if (error) newErrors.alternate_phone = error;
    }

    if (form.website) {
      const error = validateField("website", form.website);
      if (error) newErrors.website = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setErrors({});

    // Validate password confirmation
    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    
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
    formData.append("password", form.password);
    formData.append("password_confirmation", form.password_confirmation);
    
    // Package Information
    formData.append("subscription_package_id", form.subscription_package_id);
    formData.append("paid_via", form.paid_via);
    formData.append("payment_transaction_id", form.payment_transaction_id);
    
    // Logo
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
    <Box sx={{ px: { xs: "16px", sm: "24px", md: "42px" }, py: { xs: "20px", sm: "30px" }, width: "100%" }}>
      {/* PAGE TITLE */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: "18px", sm: "22px" },
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

      {Object.keys(errors).filter(key => errors[key]).length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrors({})}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Please fix the following errors:</Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {Object.entries(errors)
              .filter(([field, message]) => message) // Only show non-empty messages
              .map(([field, message]) => (
                <li key={field}>
                  <strong>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {message}
                </li>
              ))}
          </Box>
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
          <Grid item xs={12} md={6} sx={{ flexGrow: 1 }}>
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
                onBlur={handleBlur}
                error={!!errors.name}
                helperText={errors.name}
                sx={input}
                disabled={loading}
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
                disabled={loading}
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
                onBlur={handleBlur}
                error={!!errors.phone}
                helperText={errors.phone}
                sx={input}
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
                onBlur={handleBlur}
                error={!!errors.country}
                helperText={errors.country}
                sx={input}
                disabled={loading}
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
                onBlur={handleBlur}
                error={!!errors.city}
                helperText={errors.city}
                sx={input}
                disabled={loading}
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
                onBlur={handleBlur}
                error={!!errors.landmark}
                helperText={errors.landmark}
                sx={input}
                disabled={loading}
              />
            </Box>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={6} sx={{ flexGrow: 1 }}>
            {/* Currency */}
            <Box sx={fieldBox} >
              <Typography sx={label}>Currency*</Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="currency"
                value={form.currency}
                onChange={handle}
                onBlur={handleBlur}
                error={!!errors.currency}
                helperText={errors.currency}
                sx={input}
                disabled={loading}
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
                onBlur={handleBlur}
                error={!!errors.website}
                helperText={errors.website}
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
                onBlur={handleBlur}
                error={!!errors.alternate_phone}
                helperText={errors.alternate_phone}
                sx={input}
                disabled={loading}
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
                onBlur={handleBlur}
                error={!!errors.state}
                helperText={errors.state}
                sx={input}
                disabled={loading}
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
                onBlur={handleBlur}
                error={!!errors.zip_code}
                helperText={errors.zip_code}
                sx={input}
                disabled={loading}
              />
            </Box>

            {/* Time zone */}
            {/* <Box sx={fieldBox}>
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
                disabled={loading}
              >
                <MenuItem value="">Select Timezone</MenuItem>
                <MenuItem value="Asia/Karachi">Asia/Karachi (PKT)</MenuItem>
                <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                <MenuItem value="America/Los_Angeles">America/Los_Angeles (PST)</MenuItem>
                <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                <MenuItem value="UTC">UTC</MenuItem>
              </TextField>
            </Box> */}
          </Grid>
        </Grid>

        {/* OWNER INFORMATION SECTION */}
        <Typography sx={sectionTitle}>Owner information</Typography>

        <Grid container spacing={3}>
          {/* Prefix */}
          <Grid item xs={12} sm={4} sx={{ flexGrow: 1 }}>
            <Typography sx={label}>Prefix:</Typography>
            <TextField
              select
              fullWidth
              size="small"
              name="prefix"
              value={form.prefix}
              onChange={handle}
              sx={input}
              disabled={loading}
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

          <Grid item xs={12} sm={4} sx={{ flexGrow: 1 }}>
            <Typography sx={label}>First Name*:</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="First Name"
              name="first_name"
              value={form.first_name}
              onChange={handle}
              onBlur={handleBlur}
              error={!!errors.first_name}
              helperText={errors.first_name}
              sx={input}
              disabled={loading}
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
          <Grid item xs={12} sm={4} sx={{ flexGrow: 1 }}>
            <Typography sx={label}>Last Name*:</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={handle}
              onBlur={handleBlur}
              error={!!errors.last_name}
              helperText={errors.last_name}
              sx={input}
              disabled={loading}
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
          <Grid item xs={12} sm={6} sx={{ flexGrow: 1 }}>
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
              disabled={loading}
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
          <Grid item xs={12} sm={6} sx={{ flexGrow: 1 }}>
            <Typography sx={label}>Email*:</Typography>
            <TextField
              fullWidth
              size="small"
              type="email"
              placeholder="owner@example.com"
              name="email"
              value={form.email}
              onChange={handle}
              onBlur={handleBlur}
              error={!!errors.email}
              helperText={errors.email}
              sx={input}
              disabled={loading}
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
              name="password"
              value={form.password}
              onChange={handle}
              sx={input}
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailIcon sx={{ fontSize: 16, color: "#6B7280" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={label}>Confirm Password*:</Typography>
            <TextField
              fullWidth
              size="small"
              type="password"
              placeholder="Confirm Password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handle}
              onBlur={handleBlur}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation}
              sx={input}
              disabled={loading}
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
        <Typography sx={sectionTitle}>Package & Payment Information</Typography>
        
        <Grid container columnSpacing={6}>
          <Grid item xs={12} md={4} sx={{ flexGrow: 1 }}>
            <Typography sx={label}>Packages*:</Typography>
            <TextField 
              select 
              fullWidth 
              size="small" 
              name="subscription_package_id"
              value={form.subscription_package_id}
              onChange={handle}
              onBlur={handleBlur}
              error={!!errors.subscription_package_id}
              helperText={errors.subscription_package_id}
              sx={input}
              disabled={loading}
            >
              <MenuItem value="">Select Package</MenuItem>
              {packages.map((pkg) => (
                <MenuItem key={pkg.id} value={pkg.id}>
                  {pkg.name} - ${pkg.price}/{pkg.duration_type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4} sx={{ flexGrow: 1 }}>
            <Typography sx={label}>Payment Gateway:</Typography>
            <TextField 
              select 
              fullWidth 
              size="small" 
              name="paid_via"
              value={form.paid_via}
              onChange={handle}
              sx={input}
              disabled={loading}
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

          <Grid item xs={12} md={4} sx={{ flexGrow: 1 }}>
            <Typography sx={label}>Payment Transaction ID:</Typography>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Transaction ID"
              name="payment_transaction_id"
              value={form.payment_transaction_id}
              onChange={handle}
              sx={input}
              disabled={loading}
            />
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
