// src/pages/Packages.jsx

import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import packageService from "../services/packageService";

export default function Packages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    setError("");
    const result = await packageService.getAll();
    
    if (result.success) {
      setPackages(result.data);
    } else {
      setError(result.message || "Failed to load packages");
    }
    setLoading(false);
  };

  const handleToggleStatus = async (id) => {
    const result = await packageService.toggleStatus(id);
    if (result.success) {
      setSuccess("Package status updated successfully");
      fetchPackages();
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to update status");
    }
  };

  const handleDeleteClick = (id, event) => {
    event.stopPropagation();
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    const result = await packageService.delete(deleteDialog.id);
    if (result.success) {
      setSuccess("Package deleted successfully");
      fetchPackages();
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to delete package");
    }
    setDeleteDialog({ open: false, id: null });
  };

  const handleEdit = (id, event) => {
    event.stopPropagation();
    navigate(`/edit-package/${id}`);
  };

  const openSubscriptions = (id) => navigate(`/edit-package/${id}`);

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
          onClick={() => navigate("/add-package")}
          sx={{
            backgroundColor: "#0C2548",
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
        >
          Add
        </Button>
      </Stack>

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

      {/* Packages */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : packages.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">No packages available</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              id={pkg.id}
              title={pkg.name}
              status={pkg.is_active ? "Active" : "Inactive"}
              features={{
                max_cameras: pkg.max_cameras,
                max_locations: pkg.max_locations,
                max_users: pkg.max_users,
                analytics_enabled: pkg.analytics_enabled === 1 || pkg.analytics_enabled === true,
                api_access_enabled: pkg.api_access_enabled === 1 || pkg.api_access_enabled === true,
                recording_enabled: pkg.recording_enabled === 1 || pkg.recording_enabled === true,
                motion_detection_enabled: pkg.motion_detection_enabled === 1 || pkg.motion_detection_enabled === true,
              }}
              priceText={`$ ${pkg.price} / ${pkg.duration_type}`}
              footer={pkg.description || "Package details"}
              inactive={!pkg.is_active}
              onClick={() => openSubscriptions(pkg.id)}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this package? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ---------------------------------------------
// REUSABLE CARD COMPONENT (Figma accurate)
// ---------------------------------------------
function PackageCard({
  id,
  title,
  status,
  features,
  priceText,
  footer,
  inactive,
  onClick,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const borderColor = inactive ? "#FF4D4D" : "#1BC744";

  return (
    <Card
      onClick={onClick}
      elevation={0}
      sx={{
        width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.333% - 16px)" },
        cursor: "pointer",
        borderRadius: 3,
        border: "1px solid #E1E7EF",
        transition: "0.2s",
        "&:hover": { boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)" },
      }}
    >
      {/* Top green/red border */}
      <Box
        sx={{
          height: 4,
          backgroundColor: borderColor,
          borderRadius: "12px 12px 0 0",
        }}
      />

      <CardContent>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <Typography fontWeight="700" sx={{ fontSize: 16 }}>
            {title}
          </Typography>

          <Chip
            label={status}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(id);
            }}
            sx={{
              backgroundColor: inactive ? "#FFD6D6" : "#D2F7DF",
              color: inactive ? "#C62828" : "#16A34A",
              height: 22,
              cursor: "pointer",
            }}
          />

          {/* Edit & Delete Icons */}
          <IconButton 
            size="small"
            onClick={(e) => onEdit(id, e)}
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton 
            size="small"
            onClick={(e) => onDelete(id, e)}
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>

        {/* Package Limits */}
        <Stack spacing={1} sx={{ my: 2 }}>
          <Typography sx={{ fontSize: 13, color: "#4A4A4A", fontWeight: 500 }}>
            📹 Cameras: {features.max_cameras || 10} | 📍 Locations: {features.max_locations || 5} | 👥 Users: {features.max_users || 10}
          </Typography>
          
          {/* Features */}
          <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="center" sx={{ mt: 1 }}>
            {features.analytics_enabled && (
              <Chip label="Analytics" size="small" sx={{ fontSize: 10, height: 20 }} />
            )}
            {features.api_access_enabled && (
              <Chip label="API Access" size="small" sx={{ fontSize: 10, height: 20 }} />
            )}
            {features.recording_enabled && (
              <Chip label="Recording" size="small" sx={{ fontSize: 10, height: 20 }} />
            )}
            {features.motion_detection_enabled && (
              <Chip label="Motion Detection" size="small" sx={{ fontSize: 10, height: 20 }} />
            )}
          </Stack>
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

        {/* Footer */}
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
