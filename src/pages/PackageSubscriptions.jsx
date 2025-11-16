// src/pages/PackageSubscriptions.jsx
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

export default function Packages() {
  const navigate = useNavigate();

  // Navigate when clicking a package
  const openSubscriptions = () => navigate("/package-subscription");

  return (
    <Box>
      {/* --- Header --- */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight="700">
            Packages
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All Packages
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#0C2548",
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
        >
          Update
        </Button>
      </Stack>

      {/* Packages */}

      <Stack spacing={3}>
        {/* Row 1 */}
        <Stack direction="row" spacing={3}>
          <PackageCard
            title="Starter - Free"
            status="Active"
            features={[
              "1 Business Locations",
              "2 Users",
              "30 Products",
              "30 Invoices",
              "10 Trial Days",
              "Essentials Module",
              "WooCommerce Module",
            ]}
            priceText="Free for 1 Months"
            footer="Give it a test drive…"
            onClick={openSubscriptions}
          />

          <PackageCard
            title="Regular"
            status="Active"
            features={[
              "Unlimited Business Locations",
              "Unlimited Users",
              "Unlimited Products",
              "Unlimited Invoices",
              "10 Trial Days",
              "Repair Module",
            ]}
            priceText="$ 199.99 / 1 Months"
            footer="For Small Shops"
            onClick={openSubscriptions}
          />

          <PackageCard
            title="Unlimited"
            status="Active"
            features={[
              "Unlimited Business Locations",
              "Unlimited Users",
              "Unlimited Products",
              "Unlimited Invoices",
              "10 Trial Days",
            ]}
            priceText="$ 599.99 / 1 Months"
            footer="For Large Business"
            onClick={openSubscriptions}
          />
        </Stack>

        {/* Row 2 */}
        <Stack direction="row">
          <PackageCard
            title="Business"
            status="Inactive"
            features={[
              "10 Business Locations",
              "50 Users",
              "15000 Products",
              "1000 Invoices",
              "10 Trial Days",
            ]}
            priceText="$ 259.99 / 1 Months"
            footer="For Small & Growing Shops…"
            inactive
            onClick={openSubscriptions}
          />
        </Stack>
      </Stack>
    </Box>
  );
}

// ---------------------------------------------
// REUSABLE CARD COMPONENT (Figma accurate)
// ---------------------------------------------
function PackageCard({
  title,
  status,
  features,
  priceText,
  footer,
  inactive,
  onClick,
}) {
  const borderColor = inactive ? "#FF4D4D" : "#1BC744";

  return (
    <Card
      onClick={onClick}
      elevation={0}
      sx={{
        width: "33%",
        cursor: "pointer",
        borderRadius: 3,
        border: "1px solid #E1E7EF",
        transition: "0.2s",
        "&:hover": { boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)" },
      }}
    >
      {/* Top green border */}
      <Box sx={{ height: 4, backgroundColor: borderColor, borderRadius: "12px 12px 0 0" }} />

      <CardContent>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <Typography fontWeight="700" sx={{ fontSize: 16 }}>
            {title}
          </Typography>

          <Chip
            label={status}
            size="small"
            sx={{
              backgroundColor: inactive ? "#FFD6D6" : "#D2F7DF",
              color: inactive ? "#C62828" : "#16A34A",
              height: 22,
            }}
          />

          {/* Edit & Delete Icons */}
          <IconButton size="small">
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton size="small">
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>

        {/* Features List */}
        <Stack spacing={0.2} sx={{ my: 2 }} alignItems="center">
          {features.map((f, i) => (
            <Typography key={i} sx={{ fontSize: 13, color: "#4A4A4A" }}>
              {f}
            </Typography>
          ))}
        </Stack>

        {/* Price */}
        <Typography
          fontWeight="700"
          textAlign="center"
          sx={{ mt: 1, color: "#1A1A1A", fontSize: 18 }}
        >
          {priceText}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* Footer text */}
        <Typography
          textAlign="center"
          sx={{ fontSize: 12, color: "#7A7A7A", mt: 1 }}
        >
          {footer}
        </Typography>
      </CardContent>
    </Card>
  );
}
