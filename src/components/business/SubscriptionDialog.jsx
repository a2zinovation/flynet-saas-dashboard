// src/components/business/SubscriptionDialog.jsx

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import businessService from "../../services/businessService";
import packageService from "../../services/packageService";
import settingsService from "../../services/settingsService";

export default function SubscriptionDialog({ open, onClose, businessId, businessName, onSuccess }) {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Subscription form
  const [form, setForm] = useState({
    business_id: businessId,
    subscription_package_id: "",
    paid_via: "",
    payment_transaction_id: "",
    start_date: "",
  });
  
  // Data
  const [packages, setPackages] = useState([]);
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPackages();
      fetchPaymentGateways();
      fetchSubscriptionHistory();
      fetchCurrentSubscription();
      setForm(prev => ({ ...prev, business_id: businessId }));
    }
  }, [open, businessId]);

  const fetchPackages = async () => {
    const result = await packageService.getAll();
    if (result.success) {
      setPackages(result.data.filter(pkg => pkg.is_active == 1));
    }
  };

  const fetchPaymentGateways = async () => {
    const result = await settingsService.getPaymentGateways();
    if (result.success) {
      setPaymentGateways(result.data.filter(gw => gw.is_active));
    }
  };

  const fetchSubscriptionHistory = async () => {
    setLoadingHistory(true);
    const result = await businessService.getSubscriptions(businessId);
    if (result.success) {
      setSubscriptions(result.data);
    }
    setLoadingHistory(false);
  };

  const fetchCurrentSubscription = async () => {
    const result = await businessService.getCurrentSubscription(businessId);
    if (result.success) {
      setCurrentSubscription(result.data);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await businessService.addSubscription(form);
    
    if (result.success) {
      setSuccess("Subscription added successfully!");
      setTimeout(() => {
        setSuccess("");
        onSuccess();
        onClose();
      }, 2000);
      
      // Refresh data
      fetchSubscriptionHistory();
      fetchCurrentSubscription();
      
      // Reset form
      setForm({
        business_id: businessId,
        subscription_package_id: "",
        paid_via: "",
        payment_transaction_id: "",
        start_date: "",
      });
    } else {
      setError(result.message || "Failed to add subscription");
    }
    setLoading(false);
  };

  const selectedPackage = packages.find(pkg => pkg.id == form.subscription_package_id);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Manage Subscription
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {businessName}
            </Typography>
          </Box>
          {currentSubscription && (
            <Chip
              label={`Current: ${currentSubscription.package_name || "Active"}`}
              color="success"
              size="small"
            />
          )}
        </Stack>
      </DialogTitle>

      <Divider />

      {error && (
        <Alert severity="error" sx={{ mx: 3, mt: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mx: 3, mt: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab icon={<AddIcon />} iconPosition="start" label="Add/Renew Subscription" />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="Subscription History" />
        </Tabs>
      </Box>

      <DialogContent sx={{ minHeight: 400 }}>
        {/* Tab 1: Add/Renew Subscription */}
        {tab === 0 && (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              {/* Current Subscription Info */}
              {currentSubscription && (
                <Paper elevation={0} sx={{ p: 2, bgcolor: "#F0F9FF", border: "1px solid #BFDBFE" }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Current Active Subscription
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      Package: <strong>{currentSubscription.package_name}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Start Date: {currentSubscription.start_date ? new Date(currentSubscription.start_date).toLocaleDateString() : "—"}
                    </Typography>
                    <Typography variant="body2">
                      End Date: {currentSubscription.end_date ? new Date(currentSubscription.end_date).toLocaleDateString() : "—"}
                    </Typography>
                    {currentSubscription.days_remaining && (
                      <Chip
                        label={`${currentSubscription.days_remaining} days remaining`}
                        size="small"
                        color={currentSubscription.days_remaining < 7 ? "error" : "success"}
                        sx={{ mt: 1, width: "fit-content" }}
                      />
                    )}
                  </Stack>
                </Paper>
              )}

              {/* Package Selection */}
              <FormControl fullWidth required>
                <Typography sx={{ fontWeight: 600, fontSize: 13.5, mb: 1 }}>
                  Select Package
                </Typography>
                <Select
                  name="subscription_package_id"
                  value={form.subscription_package_id}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">-- Select Package --</MenuItem>
                  {packages.map(pkg => (
                    <MenuItem key={pkg.id} value={pkg.id}>
                      {pkg.name} - ${pkg.price} / {pkg.duration} {pkg.price_interval}(s)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Package Details */}
              {selectedPackage && (
                <Paper elevation={0} sx={{ p: 2, bgcolor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Package Details
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      📹 Max Cameras: {selectedPackage.max_cameras || "Unlimited"}
                    </Typography>
                    <Typography variant="body2">
                      👥 Max Users: {selectedPackage.max_users || "Unlimited"}
                    </Typography>
                    <Typography variant="body2">
                      📅 Duration: {selectedPackage.duration} {selectedPackage.price_interval}(s)
                    </Typography>
                    <Typography variant="body2">
                      💰 Price: ${selectedPackage.price}
                    </Typography>
                    {selectedPackage.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {selectedPackage.description}
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              )}

              {/* Start Date */}
              <FormControl fullWidth required>
                <Typography sx={{ fontWeight: 600, fontSize: 13.5, mb: 1 }}>
                  Start Date
                </Typography>
                <TextField
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>

              {/* Payment Gateway */}
              <FormControl fullWidth required>
                <Typography sx={{ fontWeight: 600, fontSize: 13.5, mb: 1 }}>
                  Payment Gateway
                </Typography>
                <Select
                  name="paid_via"
                  value={form.paid_via}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">-- Select Gateway --</MenuItem>
                  {paymentGateways.map(gw => (
                    <MenuItem key={gw.id} value={gw.name}>
                      {gw.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Transaction ID */}
              <FormControl fullWidth>
                <Typography sx={{ fontWeight: 600, fontSize: 13.5, mb: 1 }}>
                  Payment Transaction ID
                </Typography>
                <TextField
                  name="payment_transaction_id"
                  value={form.payment_transaction_id}
                  onChange={handleChange}
                  placeholder="Enter transaction ID"
                  fullWidth
                />
              </FormControl>
            </Stack>
          </Box>
        )}

        {/* Tab 2: Subscription History */}
        {tab === 1 && (
          <Box sx={{ mt: 2 }}>
            {loadingHistory ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : subscriptions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No subscription history found</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#F9FAFB" }}>
                    <TableRow>
                      <TableCell>Package</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Payment Gateway</TableCell>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptions.map((sub, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{sub.package_name || "—"}</TableCell>
                        <TableCell>
                          {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>
                          {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>${sub.price || "0"}</TableCell>
                        <TableCell>{sub.paid_via || "—"}</TableCell>
                        <TableCell>{sub.payment_transaction_id || "—"}</TableCell>
                        <TableCell>
                          <Chip
                            label={sub.is_active ? "Active" : "Expired"}
                            size="small"
                            color={sub.is_active ? "success" : "default"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {tab === 0 && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !form.subscription_package_id || !form.paid_via || !form.start_date}
            sx={{
              backgroundColor: "#0C2548",
              textTransform: "none",
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            {currentSubscription ? "Renew Subscription" : "Add Subscription"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
