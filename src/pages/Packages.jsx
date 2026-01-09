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
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useNavigate } from "react-router-dom";
import packageService from "../services/packageService";

export default function Packages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deletedDialog, setDeletedDialog] = useState(false);
  const [deletedPackages, setDeletedPackages] = useState([]);
  const [loadingDeleted, setLoadingDeleted] = useState(false);

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

  const handleViewDeleted = async () => {
    setDeletedDialog(true);
    setLoadingDeleted(true);
    const result = await packageService.getDeleted();
    
    if (result.success) {
      setDeletedPackages(result.data);
    } else {
      setError(result.message || "Failed to load deleted packages");
    }
    setLoadingDeleted(false);
  };

  const handleRestore = async (id) => {
    const result = await packageService.restore(id);
    if (result.success) {
      setSuccess("Package restored successfully");
      fetchPackages();
      handleViewDeleted(); // Refresh deleted list
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to restore package");
    }
  };

  return (
    <Box>
      {/* --- Header --- */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={{ xs: 2, sm: 0 }}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight="700" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
            Packages
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All New Packages
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<DeleteSweepIcon />}
            onClick={handleViewDeleted}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            View Deleted
          </Button>
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : packages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No packages available</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 3 } }}>
            {packages.map((pkg) => {
          const intervalDisplay = pkg.price_interval === 'monthly' ? 'Month' : 'Year';
          const pluralInterval = pkg.duration > 1 ? intervalDisplay + 's' : intervalDisplay;
          
          return (
            <PackageCard
              key={pkg.id}
              id={pkg.id}
              title={pkg.name}
              status={pkg.is_active == 1 ? "Active" : "Inactive"}
              features={{
                    max_cameras: pkg.max_cameras,
                    duration: pkg.duration,
                    max_users: pkg.max_users,
                  }}
                  priceText={`$ ${pkg.price} / ${pkg.duration} ${pluralInterval}`}
                  footer={pkg.description || "Package details"}
                  inactive={pkg.is_active == 0}
                  onClick={() => openSubscriptions(pkg.id)}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onToggleStatus={handleToggleStatus}
                />
              );
            })}
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

      {/* Deleted Packages Dialog */}
      <Dialog 
        open={deletedDialog} 
        onClose={() => setDeletedDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteSweepIcon />
          Deleted Packages
        </DialogTitle>
        <DialogContent>
          {loadingDeleted ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : deletedPackages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">No deleted packages found</Typography>
            </Box>
          ) : (
            <Stack spacing={2} sx={{ mt: 2 }}>
              {deletedPackages.map((pkg) => {
                const intervalDisplay = pkg.price_interval == 'monthly' ? 'Month' : 'Year';
                const pluralInterval = pkg.duration > 1 ? intervalDisplay + 's' : intervalDisplay;
                
                return (
                  <Card
                    key={pkg.id}
                    elevation={0}
                    sx={{
                      border: '1px solid #E1E7EF',
                      borderRadius: 2,
                      opacity: 0.8,
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={600} sx={{ mb: 1 }}>
                            {pkg.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            📹 Cameras: {pkg.max_cameras || 0} | 👥 Users: {pkg.max_users || 0}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="primary">
                            $ {pkg.price} / {pkg.duration} {pluralInterval}
                          </Typography>
                          {pkg.description && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                              {pkg.description}
                            </Typography>
                          )}
                          {pkg.deleted_at && (
                            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                              Deleted: {new Date(pkg.deleted_at).toLocaleString()}
                            </Typography>
                          )}
                        </Box>
                        
                        <Button
                          variant="contained"
                          startIcon={<RestoreIcon />}
                          onClick={() => handleRestore(pkg.id)}
                          sx={{
                            backgroundColor: "#10B981",
                            textTransform: "none",
                            '&:hover': {
                              backgroundColor: "#059669",
                            }
                          }}
                        >
                          Restore
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletedDialog(false)}>Close</Button>
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
          <Typography sx={{ fontSize: 13, color: "#4A4A4A", fontWeight: 500 , textAlign: "center"}}>
            📹 Cameras: {features.max_cameras || 0} | 👥 Users: {features.max_users || 0}
          </Typography>
          
          {/* Features */}
          {/* <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="center" sx={{ mt: 1 }}>
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
          </Stack> */}
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
