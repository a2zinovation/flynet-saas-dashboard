// src/pages/Settings.jsx
import React, { useState } from "react";
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
} from "@mui/material";

import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PublicIcon from "@mui/icons-material/Public";
import NumbersIcon from "@mui/icons-material/Numbers";
import PaymentsIcon from "@mui/icons-material/Payments";

export default function Settings() {
  const [tab, setTab] = useState("super-admin"); // Default Tab

  return (
    <Box sx={{ p: 2, height: "100%", overflowY: "auto" }}>
      {/* PAGE TITLE */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Super Admin Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Edit settings
      </Typography>

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
                backgroundColor:
                  tab === item.id ? "#0C2548" : "transparent",
                color: tab === item.id ? "#fff" : "#000",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* RIGHT CONTENT */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          {/* ░░░ SUPER ADMIN SETTINGS TAB ░░░ */}
          {tab === "super-admin" && (
            <Box>
              <Stack spacing={3}>
                <Stack direction="row" spacing={3}>
                  {/* Business Name */}
                  <TextField
                    label="Business Name"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Email */}
                  <TextField
                    label="Email"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Currency */}
                  <FormControl fullWidth>
                    <Typography variant="caption">Currency:</Typography>
                    <Select defaultValue="usd" size="small">
                      <MenuItem value="usd">America - Dollars (USD)</MenuItem>
                      <MenuItem value="eur">Europe - Euro (EUR)</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                {/* Row 2 */}
                <Stack direction="row" spacing={3}>
                  <TextField
                    label="Landmark"
                    fullWidth
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PublicIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>

                {/* Row 3 */}
                <Stack direction="row" spacing={3}>
                  <TextField
                    label="City"
                    fullWidth
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NumbersIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>

                {/* Toggle */}
                <FormControlLabel
                  control={<Checkbox />}
                  label="Enable business based username"
                />

                <Typography variant="body2" color="text.secondary">
                  If enabled, business ID will be suffixed to username.
                  This only applies to newly created users.
                </Typography>
              </Stack>
            </Box>
          )}

          {/* ░░░ EMAIL / SMTP TAB ░░░ */}
          {tab === "email" && (
            <Box>
              <Stack spacing={3}>
                {/* First Row */}
                <Stack direction="row" spacing={3}>
                  <FormControl fullWidth>
                    <Typography variant="caption">Mail Driver</Typography>
                    <Select defaultValue="smtp" size="small">
                      <MenuItem value="smtp">SMTP</MenuItem>
                      <MenuItem value="sendgrid">SendGrid</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField label="Host" fullWidth />
                  <TextField label="Port" fullWidth />
                </Stack>

                {/* Second Row */}
                <Stack direction="row" spacing={3}>
                  <TextField label="Username" fullWidth />
                  <TextField label="Password" fullWidth />
                  <TextField label="Encryption (tls / ssl)" fullWidth />
                </Stack>

                {/* From Section */}
                <Stack direction="row" spacing={3}>
                  <TextField label="From Address" fullWidth />
                  <TextField label="From Name" fullWidth />
                </Stack>

                {/* Checkboxes */}
                <FormControlLabel
                  control={<Checkbox />}
                  label="Allow businesses to use Superadmin email configuration"
                />

                <FormControlLabel
                  control={<Checkbox />}
                  label="Enable new business registration email"
                />

                <FormControlLabel
                  control={<Checkbox />}
                  label="Enable new subscription email"
                />

                <Divider />

                <FormControlLabel
                  control={<Checkbox />}
                  label="Enable welcome email to new business"
                />

                {/* Template */}
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Welcome Email Template:
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Available Tags: {"{business_name}, {owner_name}"}
                </Typography>

                <TextField label="Welcome email subject" fullWidth sx={{ mt: 1 }} />
              </Stack>
            </Box>
          )}

          {/* ░░░ PAYMENT GATEWAY TAB ░░░ */}
          {tab === "payment" && (
            <Box>
              <Stack spacing={3}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Enable Offline Payment"
                />

                <TextField
                  label="Offline payment details"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PaymentsIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <Divider sx={{ my: 2 }} />

                {/* STRIPE */}
                <Typography variant="h6" fontWeight={700} color="#0C2548">
                  Stripe
                </Typography>

                <Stack direction="row" spacing={3}>
                  <TextField label="Stripe Public Key" fullWidth />
                  <TextField label="Stripe Secret Key" fullWidth />
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* PAYPAL */}
                <Typography variant="h6" fontWeight={700} color="#0C2548">
                  PayPal
                </Typography>

                <Stack direction="row" spacing={3}>
                  <TextField label="PayPal Client ID" fullWidth />
                  <TextField label="PayPal Secret Key" fullWidth />
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* RAZORPAY */}
                <Typography variant="h6" fontWeight={700} color="#0C2548">
                  Razorpay
                </Typography>

                <Stack direction="row" spacing={3}>
                  <TextField label="Key ID" fullWidth />
                  <TextField label="Key Secret" fullWidth />
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* UPDATE BUTTON */}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#0C2548",
                    width: 120,
                    textTransform: "none",
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
