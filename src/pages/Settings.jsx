// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
  Divider,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";

import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PublicIcon from "@mui/icons-material/Public";
import NumbersIcon from "@mui/icons-material/Numbers";
import PaymentsIcon from "@mui/icons-material/Payments";
import DeleteIcon from "@mui/icons-material/Delete";
import settingsService from "../services/settingsService";

export default function Settings() {
  const [tab, setTab] = useState("super-admin");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Super Admin Settings State
  const [superAdminSettings, setSuperAdminSettings] = useState({
    business_name: "",
    email: "",
    landmark: "",
    zip_code: "",
    state: "",
    city: "",
    country: "",
    min_subscription_expiry_alert_days: "",
    enable_business_based_username: false,
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    mail_driver: "smtp",
    mail_host: "",
    mail_port: "",
    mail_username: "",
    mail_password: "",
    mail_encryption: "",
    mail_from_address: "",
    mail_from_name: "",
    enable_new_business_registration_email: false,
    enable_new_subscription_email: false,
    enable_welcome_email_to_new_business: false,
    welcome_email_subject: "",
  });

  // Payment Gateways State
  const [gateways, setGateways] = useState([]);
  const [editingGateway, setEditingGateway] = useState(null);

  // Fetch data on tab change
  useEffect(() => {
    if (tab === "super-admin") {
      fetchSuperAdminSettings();
    } else if (tab === "email") {
      fetchEmailSettings();
    } else if (tab === "payment") {
      fetchPaymentGateways();
    }
  }, [tab]);

  const fetchSuperAdminSettings = async () => {
    setLoading(true);
    setError("");
    const result = await settingsService.getSuperAdminSettings();
    
    if (result.success && result.data) {
      setSuperAdminSettings(result.data);
    } else {
      setError(result.message || "Failed to load settings");
    }
    setLoading(false);
  };

  const fetchEmailSettings = async () => {
    setLoading(true);
    setError("");
    const result = await settingsService.getEmailSettings();
    
    if (result.success && result.data) {
      setEmailSettings(result.data);
    } else {
      setError(result.message || "Failed to load email settings");
    }
    setLoading(false);
  };

  const fetchPaymentGateways = async () => {
    setLoading(true);
    setError("");
    const result = await settingsService.getPaymentGateways();
    
    if (result.success) {
      setGateways(result.data);
    } else {
      setError(result.message || "Failed to load payment gateways");
    }
    setLoading(false);
  };

  const handleSaveSuperAdminSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    
    const result = await settingsService.updateSuperAdminSettings(superAdminSettings);
    
    if (result.success) {
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to save settings");
    }
    setSaving(false);
  };

  const handleSaveEmailSettings = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    
    const result = await settingsService.updateEmailSettings(emailSettings);
    
    if (result.success) {
      setSuccess("Email settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to save email settings");
    }
    setSaving(false);
  };

  const handleSaveGateway = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    let result;
    if (editingGateway?.id) {
      // Update existing
      result = await settingsService.updatePaymentGateway(editingGateway.id, editingGateway);
    } else {
      // Create new
      result = await settingsService.createPaymentGateway(editingGateway);
    }

    if (result.success) {
      setSuccess(editingGateway?.id ? "Gateway updated successfully!" : "Gateway added successfully!");
      setEditingGateway(null);
      fetchPaymentGateways();
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to save gateway");
    }
    setSaving(false);
  };

  const handleDeleteGateway = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment gateway?")) return;
    
    setSaving(true);
    setError("");
    const result = await settingsService.deletePaymentGateway(id);
    
    if (result.success) {
      setSuccess("Gateway deleted successfully!");
      fetchPaymentGateways();
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to delete gateway");
    }
    setSaving(false);
  };

  return (
    <Box sx={{ p: 2, height: "100%", overflowY: "auto" }}>
      {/* PAGE TITLE */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Super Admin Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Edit settings
      </Typography>

      {/* ALERTS */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          display: "flex",
          borderRadius: 2,
          border: "1px solid #E8EDF2",
          p: 0,
          minHeight: "80vh",
        }}
      >
        {/* LEFT TABS */}
        <Box
          sx={{
            width: 200,
            borderRight: "1px solid #E8EDF2",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {[
            { id: "super-admin", label: "Super Admin Settings" },
            { id: "email", label: "Email/SMTP Settings" },
            { id: "payment", label: "Payment Gateway" },
          ].map((item) => (
            <Button
              key={item.id}
              fullWidth
              onClick={() => setTab(item.id)}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontWeight: 600,
                p: 2,
                borderRadius: 0,
                backgroundColor: tab === item.id ? "#0C2548" : "transparent",
                color: tab === item.id ? "#fff" : "#000",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* RIGHT CONTENT */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          {/* SUPER ADMIN SETTINGS TAB */}
          {tab === "super-admin" && (
            <Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Stack spacing={3}>
                  <Stack direction="row" spacing={3}>
                    <TextField
                      label="Business Name"
                      fullWidth
                      value={superAdminSettings.business_name}
                      onChange={(e) => setSuperAdminSettings({ ...superAdminSettings, business_name: e.target.value })}
                      disabled={saving}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Email"
                      fullWidth
                      value={superAdminSettings.email}
                      onChange={(e) => setSuperAdminSettings({ ...superAdminSettings, email: e.target.value })}
                      disabled={saving}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField
                      label="Landmark"
                      fullWidth
                      value={superAdminSettings.landmark}
                      onChange={(e) => setSuperAdminSettings({ ...superAdminSettings, landmark: e.target.value })}
                      disabled={saving}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Zip Code"
                      fullWidth
                      value={superAdminSettings.zip_code}
                      onChange={(e) => setSuperAdminSettings({ ...superAdminSettings, zip_code: e.target.value })}
                      disabled={saving}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PinDropIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="State"
                      fullWidth
                      value={superAdminSettings.state}
                      onChange={(e) => setSuperAdminSettings({ ...superAdminSettings, state: e.target.value })}
                      disabled={saving}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PublicIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField
                      label="City"
                      fullWidth
                      value={superAdminSettings.city}
                      onChange={(e) => setSuperAdminSettings({ ...superAdminSettings, city: e.target.value })}
                      disabled={saving}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Country"
                      fullWidth
                      value={superAdminSettings.country}
                      onChange={(e) => setSuperAdminSettings({ ...superAdminSettings, country: e.target.value })}
                      disabled={saving}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PublicIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Min days for subscription expiry alert"
                      fullWidth
                      type="number"
                      value={superAdminSettings.min_subscription_expiry_alert_days}
                      onChange={(e) => setSuperAdminSettings({ ...superAdminSettings, min_subscription_expiry_alert_days: e.target.value })}
                      disabled={saving}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <NumbersIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>

                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={superAdminSettings.enable_business_based_username}
                        onChange={(e) => setSuperAdminSettings({ ...superAdminSettings, enable_business_based_username: e.target.checked })}
                        disabled={saving}
                      />
                    }
                    label="Enable business based username"
                  />

                  <Typography variant="body2" color="text.secondary">
                    If enabled, business ID will be suffixed to username.
                    This only applies to newly created users.
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveSuperAdminSettings}
                      disabled={saving}
                      sx={{
                        backgroundColor: "#0C2548",
                        textTransform: "none",
                        minWidth: 120,
                      }}
                    >
                      {saving ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                      Save Settings
                    </Button>
                  </Box>
                </Stack>
              )}
            </Box>
          )}

          {/* EMAIL / SMTP TAB */}
          {tab === "email" && (
            <Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Stack spacing={3}>
                  <Stack direction="row" spacing={3}>
                    <FormControl fullWidth>
                      <Typography variant="caption">Mail Driver</Typography>
                      <Select 
                        value={emailSettings.mail_driver} 
                        onChange={(e) => setEmailSettings({ ...emailSettings, mail_driver: e.target.value })}
                        disabled={saving}
                        size="small"
                      >
                        <MenuItem value="smtp">SMTP</MenuItem>
                        <MenuItem value="sendgrid">SendGrid</MenuItem>
                        <MenuItem value="mailgun">Mailgun</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField 
                      label="Host" 
                      fullWidth 
                      value={emailSettings.mail_host}
                      onChange={(e) => setEmailSettings({ ...emailSettings, mail_host: e.target.value })}
                      disabled={saving}
                    />
                    <TextField 
                      label="Port" 
                      fullWidth 
                      value={emailSettings.mail_port}
                      onChange={(e) => setEmailSettings({ ...emailSettings, mail_port: e.target.value })}
                      disabled={saving}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField 
                      label="Username" 
                      fullWidth 
                      value={emailSettings.mail_username}
                      onChange={(e) => setEmailSettings({ ...emailSettings, mail_username: e.target.value })}
                      disabled={saving}
                    />
                    <TextField 
                      label="Password" 
                      fullWidth 
                      type="password"
                      value={emailSettings.mail_password}
                      onChange={(e) => setEmailSettings({ ...emailSettings, mail_password: e.target.value })}
                      disabled={saving}
                    />
                    <TextField 
                      label="Encryption (tls / ssl)" 
                      fullWidth 
                      value={emailSettings.mail_encryption}
                      onChange={(e) => setEmailSettings({ ...emailSettings, mail_encryption: e.target.value })}
                      disabled={saving}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField 
                      label="From Address" 
                      fullWidth 
                      value={emailSettings.mail_from_address}
                      onChange={(e) => setEmailSettings({ ...emailSettings, mail_from_address: e.target.value })}
                      disabled={saving}
                    />
                    <TextField 
                      label="From Name" 
                      fullWidth 
                      value={emailSettings.mail_from_name}
                      onChange={(e) => setEmailSettings({ ...emailSettings, mail_from_name: e.target.value })}
                      disabled={saving}
                    />
                  </Stack>

                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={emailSettings.enable_new_business_registration_email}
                        onChange={(e) => setEmailSettings({ ...emailSettings, enable_new_business_registration_email: e.target.checked })}
                        disabled={saving}
                      />
                    }
                    label="Enable new business registration email"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={emailSettings.enable_new_subscription_email}
                        onChange={(e) => setEmailSettings({ ...emailSettings, enable_new_subscription_email: e.target.checked })}
                        disabled={saving}
                      />
                    }
                    label="Enable new subscription email"
                  />

                  <Divider />

                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={emailSettings.enable_welcome_email_to_new_business}
                        onChange={(e) => setEmailSettings({ ...emailSettings, enable_welcome_email_to_new_business: e.target.checked })}
                        disabled={saving}
                      />
                    }
                    label="Enable welcome email to new business"
                  />

                  <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    Welcome Email Template:
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Available Tags: {"{business_name}, {owner_name}"}
                  </Typography>

                  <TextField 
                    label="Welcome email subject" 
                    fullWidth 
                    sx={{ mt: 1 }} 
                    value={emailSettings.welcome_email_subject}
                    onChange={(e) => setEmailSettings({ ...emailSettings, welcome_email_subject: e.target.value })}
                    disabled={saving}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveEmailSettings}
                      disabled={saving}
                      sx={{
                        backgroundColor: "#0C2548",
                        textTransform: "none",
                        minWidth: 120,
                      }}
                    >
                      {saving ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                      Save Settings
                    </Button>
                  </Box>
                </Stack>
              )}
            </Box>
          )}

          {/* PAYMENT TAB (FINAL UPDATED WITH ADD BUTTON) */}
          {tab === "payment" && (
            <Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {/* TOP BAR WITH ADD BUTTON */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      Payment Gateways
                    </Typography>

                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#0C2548", textTransform: "none" }}
                      onClick={() =>
                        setEditingGateway({
                          name: "",
                          api_key: "",
                          api_secret: "",
                          is_active: true,
                        })
                      }
                      disabled={saving}
                    >
                      + Add Gateway
                    </Button>
                  </Stack>

                  {/* EXISTING GATEWAYS LIST */}
                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {gateways.length === 0 ? (
                      <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                        No payment gateways configured yet. Click "Add Gateway" to create one.
                      </Typography>
                    ) : (
                      gateways.map((gw) => (
                        <Paper
                          key={gw.id}
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid #E2E8F0",
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Stack>
                              <Typography variant="subtitle1" fontWeight={700}>
                                {gw.name}
                              </Typography>

                              <Typography variant="body2" color="text.secondary">
                                {gw.api_key ? "Configured" : "Not Configured"}
                                {gw.is_active ? " • Active" : " • Inactive"}
                              </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setEditingGateway(gw)}
                                sx={{ textTransform: "none" }}
                                disabled={saving}
                              >
                                Edit
                              </Button>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteGateway(gw.id)}
                                disabled={saving}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Paper>
                      ))
                    )}
                  </Stack>
                </>
              )}

              {/* ADD / EDIT FORM */}
              {editingGateway && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    {editingGateway?.id
                      ? `Update ${editingGateway.name}`
                      : "Add Payment Gateway"}
                  </Typography>

                  <Stack spacing={3}>
                    <TextField
                      label="Gateway Name (e.g., Stripe, PayPal)"
                      fullWidth
                      value={editingGateway?.name || ""}
                      onChange={(e) =>
                        setEditingGateway({
                          ...editingGateway,
                          name: e.target.value,
                        })
                      }
                      disabled={saving}
                    />

                    <TextField
                      label="Public / Client Key"
                      fullWidth
                      value={editingGateway?.api_key || ""}
                      onChange={(e) =>
                        setEditingGateway({
                          ...editingGateway,
                          api_key: e.target.value,
                        })
                      }
                      disabled={saving}
                    />

                    <TextField
                      label="Secret Key"
                      fullWidth
                      type="password"
                      value={editingGateway?.api_secret || ""}
                      onChange={(e) =>
                        setEditingGateway({
                          ...editingGateway,
                          api_secret: e.target.value,
                        })
                      }
                      disabled={saving}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={editingGateway?.is_active !== false}
                          onChange={(e) =>
                            setEditingGateway({
                              ...editingGateway,
                              is_active: e.target.checked,
                            })
                          }
                          disabled={saving}
                        />
                      }
                      label="Active"
                    />

                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#0C2548",
                          minWidth: 120,
                          textTransform: "none",
                        }}
                        onClick={handleSaveGateway}
                        disabled={saving || !editingGateway?.name}
                      >
                        {saving ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                        {editingGateway?.id ? "Update" : "Add Gateway"}
                      </Button>

                      <Button
                        variant="outlined"
                        onClick={() => setEditingGateway(null)}
                        disabled={saving}
                        sx={{ textTransform: "none" }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}