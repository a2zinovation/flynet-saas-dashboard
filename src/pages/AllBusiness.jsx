// src/pages/AllBusiness.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { useNavigate } from "react-router-dom";
import businessService from "../services/businessService";

/**
 * AllBusiness.jsx
 * - Manages all businesses with API integration
 * - CRUD operations connected to Laravel backend
 */

const statusColor = (s) => {
  if (s === "active" || s === "Active") return "success";
  if (s === "pending" || s === "Pending") return "warning";
  if (s === "inactive" || s === "Inactive") return "default";
  return "default";
};

export default function AllBusiness() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(25);
  const [rows, setRows] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  // Fetch businesses from API
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    setError("");
    const result = await businessService.getAll();
    
    if (result.success) {
      setRows(result.data);
    } else {
      setError(result.message || "Failed to load businesses");
    }
    setLoading(false);
  };

  const handleToggleStatus = async (id) => {
    const result = await businessService.toggleStatus(id);
    if (result.success) {
      setSuccessMessage("Business status updated successfully");
      fetchBusinesses(); // Refresh the list
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError(result.message || "Failed to update status");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    const result = await businessService.delete(deleteDialog.id);
    if (result.success) {
      setSuccessMessage("Business deleted successfully");
      fetchBusinesses(); // Refresh the list
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError(result.message || "Failed to delete business");
    }
    setDeleteDialog({ open: false, id: null });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [
        r.name,
        r.owner,
        r.email,
        r.id,
        r.phone,
        r.address,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, search]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="700">
            All Businesses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage all business
          </Typography>
        </Box>

        {/* Top controls (language etc are in header; here we keep actions) */}
        <Stack direction="row" spacing={0} alignItems="center">
          <Button
            startIcon={<FilterListIcon />}
            variant="outlined"
            onClick={() => setFilterOpen((s) => !s)}
            sx={{ textTransform: "none", borderRadius: 2,mr :2 }}  // ← moves button to the right
          >
            Filters
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/add-business")}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: "#0C2548",
              mr:5         // ← moves button to the right
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

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #E8EDF2" }}>
        {/* Toolbar row (entries, export buttons, search) */}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Show</Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={entries}
                onChange={(e) => setEntries(Number(e.target.value))}
                size="small"
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2">entries</Typography>

            {/* export buttons */}
            <Button startIcon={<UploadFileOutlinedIcon />} size="small" sx={{ ml: 1, textTransform: "none" }}>
              Export CSV
            </Button>
            <Button startIcon={<FileDownloadOutlinedIcon />} size="small" sx={{ textTransform: "none" }}>
              Export Excel
            </Button>
            <Button startIcon={<PrintOutlinedIcon />} size="small" sx={{ textTransform: "none" }}>
              Print
            </Button>
            <Button startIcon={<ViewColumnOutlinedIcon />} size="small" sx={{ textTransform: "none" }}>
              Column visibility
            </Button>
            <Button startIcon={<UploadFileOutlinedIcon />} size="small" sx={{ textTransform: "none" }}>
              Export PDF
            </Button>
          </Stack>

          {/* Search */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>

        {/* Filters panel (toggles below toolbar) */}
        {filterOpen && (
          <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2">Filter placeholder — add filters here</Typography>
              <Button size="small" variant="contained" onClick={() => setFilterOpen(false)} sx={{ ml: "auto", textTransform: "none" }}>
                Apply
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Table */}
        <Box sx={{ mt: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#FBFCFE" }}>
                <TableRow>
                  <TableCell sx={{ width: 180 }}>Registered on</TableCell>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Business Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Current Subscription</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.slice(0, entries).map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      {row.created_at ? new Date(row.created_at).toLocaleString() : "—"}
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{row.name || "—"}</Typography>
                    </TableCell>
                    <TableCell>{row.owner || "—"}</TableCell>
                    <TableCell>{row.email || "—"}</TableCell>
                    <TableCell>{row.phone || "—"}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.is_active ? "Active" : "Inactive"} 
                        color={statusColor(row.is_active ? "Active" : "Inactive")} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {row.subscription_package?.name || "No Package"}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="column" spacing={0.5} alignItems="flex-end">
                        <Button 
                          size="small" 
                          variant="outlined" 
                          sx={{ textTransform: "none", minWidth: 84 }}
                          onClick={() => navigate(`/edit-business/${row.id}`)}
                        >
                          Manage
                        </Button>
                        {/* <Button 
                          size="small" 
                          variant="contained" 
                          color="info" 
                          sx={{ textTransform: "none", minWidth: 84 }}
                          onClick={() => navigate(`/add-subscription/${row.id}`)}
                        >
                          Add Subscription
                        </Button> */}
                        <Stack direction="row" spacing={1}>
                          <Button 
                            size="small" 
                            color="error" 
                            variant="text" 
                            sx={{ textTransform: "none" }}
                            onClick={() => handleToggleStatus(row.id)}
                          >
                            {row.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button 
                            size="small" 
                            variant="text" 
                            sx={{ color: "#0C2548", textTransform: "none" }}
                            onClick={() => handleDeleteClick(row.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">No businesses found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Box>

        {/* Pagination placeholder (simple) */}
        <Divider sx={{ mt: 2 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
          <Typography variant="body2">
            Showing {Math.min(entries, filtered.length)} of {filtered.length} entries
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Page 1 of 1
          </Typography>
        </Stack>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this business? This action cannot be undone.</Typography>
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
