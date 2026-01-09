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
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
  Divider,
  CircularProgress,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import { useNavigate } from "react-router-dom";
import businessService from "../services/businessService";
import SubscriptionDialog from "../components/business/SubscriptionDialog";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 25,
    total: 0,
    from: 0,
    to: 0,
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    status: "all",
    package: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Column visibility state
  const [columnVisibilityOpen, setColumnVisibilityOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    registeredOn: true,
    businessName: true,
    email: true,
    contact: true,
    status: true,
    subscription: true,
  });

  // Subscription dialog state
  const [subscriptionDialog, setSubscriptionDialog] = useState({
    open: false,
    businessId: null,
    businessName: "",
  });

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

  const handleSubscriptionClick = (business) => {
    setSubscriptionDialog({
      open: true,
      businessId: business.id,
      businessName: business.name,
    });
  };

  const handleSubscriptionSuccess = () => {
    fetchBusinesses(); // Refresh the list to show updated subscription
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      package: "all",
      dateFrom: "",
      dateTo: "",
    });
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = rows;

    // Apply search filter
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((r) =>
        [
          r.name,
          r.email,
          r.id,
          r.phone,
          r.address,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter((r) => {
        if (filters.status === "active") return r.is_active == 1;
        if (filters.status === "inactive") return r.is_active != 1;
        return true;
      });
    }

    // Apply package filter
    if (filters.package !== "all") {
      result = result.filter((r) => {
        if (filters.package === "no-package") return !r.subscription_package?.name;
        return r.subscription_package?.name === filters.package;
      });
    }

    // Apply date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter((r) => {
        if (!r.created_at) return false;
        const rowDate = new Date(r.created_at);
        return rowDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter((r) => {
        if (!r.created_at) return false;
        const rowDate = new Date(r.created_at);
        return rowDate <= toDate;
      });
    }

    return result;
  }, [rows, search, filters]);

  // Paginate filtered results
  const paginated = useMemo(() => {
    const startIndex = (currentPage - 1) * entries;
    const endIndex = startIndex + entries;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, entries, currentPage]);

  // Update pagination summary
  useEffect(() => {
    const total = filtered.length;
    const lastPage = Math.max(1, Math.ceil(total / entries));
    const from = total > 0 ? (currentPage - 1) * entries + 1 : 0;
    const to = Math.min(currentPage * entries, total);
    setPagination({
      current_page: currentPage,
      last_page: lastPage,
      per_page: entries,
      total,
      from,
      to,
    });
  }, [filtered.length, entries, currentPage]);

  // Reset to first page on filters/search/entries change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters.status, filters.package, filters.dateFrom, filters.dateTo]);

  const handleEntriesChange = (e) => {
    setEntries(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get unique packages for filter dropdown
  const availablePackages = useMemo(() => {
    const packages = new Set();
    rows.forEach(row => {
      if (row.subscription_package?.name) {
        packages.add(row.subscription_package.name);
      }
    });
    return Array.from(packages).sort();
  }, [rows]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [];
    const keys = [];
    
    if (visibleColumns.registeredOn) { headers.push("Registered On"); keys.push("created_at"); }
    if (visibleColumns.businessName) { headers.push("Business Name"); keys.push("name"); }
    if (visibleColumns.email) { headers.push("Email"); keys.push("email"); }
    if (visibleColumns.contact) { headers.push("Business Contact"); keys.push("phone"); }
    if (visibleColumns.status) { headers.push("Status"); keys.push("is_active"); }
    if (visibleColumns.subscription) { headers.push("Current Subscription"); keys.push("subscription"); }

    const csvContent = [
      headers.join(","),
      ...filtered.map(row => 
        keys.map(key => {
          if (key === "created_at") return row.created_at ? new Date(row.created_at).toLocaleString() : "";
          if (key === "is_active") return row.is_active == 1 ? "Active" : "Inactive";
          if (key === "subscription") return row.subscription_package?.name || "No Package";
          return `"${(row[key] || "").toString().replace(/"/g, '""')}"`;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `businesses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Export to Excel (using HTML table method)
  const handleExportExcel = () => {
    const headers = [];
    if (visibleColumns.registeredOn) headers.push("Registered On");
    if (visibleColumns.businessName) headers.push("Business Name");
    if (visibleColumns.email) headers.push("Email");
    if (visibleColumns.contact) headers.push("Business Contact");
    if (visibleColumns.status) headers.push("Status");
    if (visibleColumns.subscription) headers.push("Current Subscription");

    let tableHTML = '<table><thead><tr>';
    headers.forEach(h => tableHTML += `<th>${h}</th>`);
    tableHTML += '</tr></thead><tbody>';

    filtered.forEach(row => {
      tableHTML += '<tr>';
      if (visibleColumns.registeredOn) tableHTML += `<td>${row.created_at ? new Date(row.created_at).toLocaleString() : ""}</td>`;
      if (visibleColumns.businessName) tableHTML += `<td>${row.name || ""}</td>`;
      if (visibleColumns.email) tableHTML += `<td>${row.email || ""}</td>`;
      if (visibleColumns.contact) tableHTML += `<td>${row.phone || ""}</td>`;
      if (visibleColumns.status) tableHTML += `<td>${row.is_active == 1 ? "Active" : "Inactive"}</td>`;
      if (visibleColumns.subscription) tableHTML += `<td>${row.subscription_package?.name || "No Package"}</td>`;
      tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';

    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `businesses_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
  };

  // Export to PDF
  const handleExportPDF = () => {
    const headers = [];
    if (visibleColumns.registeredOn) headers.push("Registered On");
    if (visibleColumns.businessName) headers.push("Business Name");
    if (visibleColumns.email) headers.push("Email");
    if (visibleColumns.contact) headers.push("Contact");
    if (visibleColumns.status) headers.push("Status");
    if (visibleColumns.subscription) headers.push("Subscription");

    const data = filtered.map(row => {
      const rowData = [];
      if (visibleColumns.registeredOn) rowData.push(row.created_at ? new Date(row.created_at).toLocaleDateString() : "");
      if (visibleColumns.businessName) rowData.push(row.name || "");
      if (visibleColumns.email) rowData.push(row.email || "");
      if (visibleColumns.contact) rowData.push(row.phone || "");
      if (visibleColumns.status) rowData.push(row.is_active == 1 ? "Active" : "Inactive");
      if (visibleColumns.subscription) rowData.push(row.subscription_package?.name || "No Package");
      return rowData;
    });

    // Simple PDF generation using window.print with formatted content
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Business List</title>');
    printWindow.document.write('<style>table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background-color:#f2f2f2;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h2>All Businesses</h2>');
    printWindow.document.write('<table><thead><tr>');
    headers.forEach(h => printWindow.document.write(`<th>${h}</th>`));
    printWindow.document.write('</tr></thead><tbody>');
    data.forEach(row => {
      printWindow.document.write('<tr>');
      row.forEach(cell => printWindow.document.write(`<td>${cell}</td>`));
      printWindow.document.write('</tr>');
    });
    printWindow.document.write('</tbody></table></body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Print functionality
  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Business List</title>');
    printWindow.document.write('<style>body{font-family:Arial,sans-serif;}table{width:100%;border-collapse:collapse;margin-top:20px;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background-color:#0C2548;color:white;}tr:nth-child(even){background-color:#f9f9f9;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>All Businesses</h1>');
    printWindow.document.write(`<p>Generated on: ${new Date().toLocaleString()}</p>`);
    printWindow.document.write('<table><thead><tr>');
    
    if (visibleColumns.registeredOn) printWindow.document.write('<th>Registered On</th>');
    if (visibleColumns.businessName) printWindow.document.write('<th>Business Name</th>');
    if (visibleColumns.email) printWindow.document.write('<th>Email</th>');
    if (visibleColumns.contact) printWindow.document.write('<th>Contact</th>');
    if (visibleColumns.status) printWindow.document.write('<th>Status</th>');
    if (visibleColumns.subscription) printWindow.document.write('<th>Subscription</th>');
    
    printWindow.document.write('</tr></thead><tbody>');
    
    filtered.forEach(row => {
      printWindow.document.write('<tr>');
      if (visibleColumns.registeredOn) printWindow.document.write(`<td>${row.created_at ? new Date(row.created_at).toLocaleString() : "—"}</td>`);
      if (visibleColumns.businessName) printWindow.document.write(`<td>${row.name || "—"}</td>`);
      if (visibleColumns.email) printWindow.document.write(`<td>${row.email || "—"}</td>`);
      if (visibleColumns.contact) printWindow.document.write(`<td>${row.phone || "—"}</td>`);
      if (visibleColumns.status) printWindow.document.write(`<td>${row.is_active == 1 ? "Active" : "Inactive"}</td>`);
      if (visibleColumns.subscription) printWindow.document.write(`<td>${row.subscription_package?.name || "No Package"}</td>`);
      printWindow.document.write('</tr>');
    });
    
    printWindow.document.write('</tbody></table></body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleToggleColumn = (column) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

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
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            startIcon={<FilterListIcon />}
            variant="outlined"
            onClick={() => setFilterOpen((s) => !s)}
            sx={{ textTransform: "none", borderRadius: 2 }}
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

      <Paper elevation={0} sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2, border: "1px solid #E8EDF2" }}>
        {/* Toolbar row (entries, export buttons, search) */}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "center" }} flexWrap="wrap">
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: { xs: 1, sm: 0 } }}>
              <Typography variant="body2">Show</Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={entries}
                  onChange={handleEntriesChange}
                  size="small"
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body2">entries</Typography>
            </Stack>

            {/* export buttons */}
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              <Button 
                startIcon={<UploadFileOutlinedIcon />} 
                size="small" 
                onClick={handleExportCSV}
                sx={{ textTransform: "none", minWidth: { xs: "auto", sm: "120px" } }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Export CSV</Box>
              </Button>
              <Button 
                startIcon={<FileDownloadOutlinedIcon />} 
                size="small" 
                onClick={handleExportExcel}
                sx={{ textTransform: "none", minWidth: { xs: "auto", sm: "120px" } }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Export Excel</Box>
              </Button>
              <Button 
                startIcon={<PrintOutlinedIcon />} 
                size="small" 
                onClick={handlePrint}
                sx={{ textTransform: "none", minWidth: { xs: "auto", sm: "80px" } }}
              >
                Print
              </Button>
              <Button 
                startIcon={<ViewColumnOutlinedIcon />} 
                size="small" 
                onClick={() => setColumnVisibilityOpen(true)}
                sx={{ textTransform: "none", minWidth: { xs: "auto", sm: "140px" } }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Column Visibility</Box>
              </Button>
              <Button 
                startIcon={<UploadFileOutlinedIcon />} 
                size="small" 
                onClick={handleExportPDF}
                sx={{ textTransform: "none", minWidth: { xs: "auto", sm: "100px" } }}
              >
                PDF
              </Button>
            </Stack>
          </Stack>

          {/* Search */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: { xs: "100%", sm: "auto" } }}>
            <TextField
              size="small"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{ maxWidth: { xs: "100%", sm: "250px" } }}
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
          <Paper variant="outlined" sx={{ p: 3, mb: 2, borderRadius: 2, backgroundColor: "#F9FAFB" }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Filter Businesses
            </Typography>
            
            <Grid container spacing={2}>
              {/* Status Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Status
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Package Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Subscription Package
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.package}
                    onChange={(e) => handleFilterChange("package", e.target.value)}
                  >
                    <MenuItem value="all">All Packages</MenuItem>
                    <MenuItem value="no-package">No Package</MenuItem>
                    {availablePackages.map((pkg) => (
                      <MenuItem key={pkg} value={pkg}>
                        {pkg}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Date From Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Registered From
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Date To Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Registered To
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            {/* Filter Actions */}
            <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
              <Button 
                size="small" 
                variant="outlined" 
                onClick={handleClearFilters}
                sx={{ textTransform: "none" }}
              >
                Clear Filters
              </Button>
              <Button 
                size="small" 
                variant="contained" 
                onClick={() => setFilterOpen(false)}
                sx={{ textTransform: "none", backgroundColor: "#0C2548" }}
              >
                Apply Filters
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Desktop Table View */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <TableContainer
            sx={{
              mt: 1,
              width: '100%',
              overflowX: 'auto',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              touchAction: 'pan-x pan-y',
              '&::-webkit-scrollbar': {
                height: 10,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: 10,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#a3a3a3',
                borderRadius: 10,
                '&:hover': { backgroundColor: '#7a7a7a' },
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table size="small" sx={{ minWidth: 1000 }}>
                <TableHead sx={{ backgroundColor: "#FBFCFE" }}>
                  <TableRow>
                    {visibleColumns.registeredOn && <TableCell sx={{ width: 160 }}>Registered on</TableCell>}
                    {visibleColumns.businessName && <TableCell>Business Name</TableCell>}
                    {visibleColumns.email && <TableCell>Email</TableCell>}
                    {visibleColumns.contact && <TableCell>Business Contact</TableCell>}
                    {visibleColumns.status && <TableCell sx={{ width: 100 }}>Status</TableCell>}
                    {visibleColumns.subscription && <TableCell>Current Subscription</TableCell>}
                    <TableCell align="center" sx={{ width: 140 }}>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginated.map((row) => (
                    <TableRow key={row.id} hover>
                      {visibleColumns.registeredOn && (
                        <TableCell>
                          {row.created_at ? new Date(row.created_at).toLocaleString() : "—"}
                        </TableCell>
                      )}
                      {visibleColumns.businessName && (
                        <TableCell>
                          <Typography fontWeight={600}>{row.name || "—"}</Typography>
                        </TableCell>
                      )}
                      {visibleColumns.email && <TableCell>{row.email || "—"}</TableCell>}
                      {visibleColumns.contact && <TableCell>{row.phone || "—"}</TableCell>}
                      {visibleColumns.status && (
                        <TableCell>
                          <Chip 
                            label={row.is_active == 1 ? "Active" : "Inactive"} 
                            color={statusColor(row.is_active == 1 ? "Active" : "Inactive")} 
                            size="small" 
                          />
                        </TableCell>
                      )}
                      {visibleColumns.subscription && (
                        <TableCell>
                          {row.subscription_package?.name || "No Package"}
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap">
                          <Tooltip title="Edit Business">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/edit-business/${row.id}`)}
                              sx={{
                                backgroundColor: "#E3F2FD",
                                color: "#1976D2",
                                borderRadius: "6px",
                                "&:hover": {
                                  backgroundColor: "#BBDEFB",
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={row.is_active == 1 ? 'Deactivate' : 'Activate'}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleStatus(row.id)}
                              sx={{
                                backgroundColor: row.is_active == 1 ? "#e0ffe1ff" : "#E8F5E9",
                                color: row.is_active == 1 ? "#00b55aff" : "#388E3C",
                                borderRadius: "6px",
                                "&:hover": {
                                  backgroundColor: row.is_active == 1 ? "#b2ffc5ff" : "#C8E6C9",
                                },
                              }}
                            >
                              {row.is_active == 1 ? (
                                <ToggleOffIcon fontSize="small" />
                              ) : (
                                <ToggleOnIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Delete Business">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(row.id)}
                              sx={{
                                backgroundColor: "#FFEBEE",
                                color: "#D32F2F",
                                borderRadius: "6px",
                                "&:hover": {
                                  backgroundColor: "#FFCDD2",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Manage Subscription">
                            <IconButton
                              size="small"
                              onClick={() => handleSubscriptionClick(row)}
                              sx={{
                                backgroundColor: "#E0F2FE",
                                color: "#0369A1",
                                borderRadius: "6px",
                                "&:hover": {
                                  backgroundColor: "#BAE6FD",
                                },
                              }}
                            >
                              <CardMembershipIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filtered.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary">No businesses found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Box>

        {/* Mobile Card View */}
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filtered.length > 0 ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              {paginated.map((row) => (
                <Paper
                  key={row.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: '1px solid #E8EDF2',
                    borderRadius: 2,
                    backgroundColor: '#FBFCFE',
                  }}
                >
                  {/* Header: Name + Status */}
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                    <Box sx={{ flex: 1, pr: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.25 }}>
                        {row.name || "—"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
                      </Typography>
                    </Box>
                    <Chip 
                      label={row.is_active == 1 ? "Active" : "Inactive"} 
                      color={statusColor(row.is_active == 1 ? "Active" : "Inactive")} 
                      size="small"
                      sx={{ flexShrink: 0 }}
                    />
                  </Stack>

                  {/* Details */}
                  <Stack spacing={1} sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid #E8EDF2' }}>
                    {row.email && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                          Email
                        </Typography>
                        <Typography variant="body2">{row.email}</Typography>
                      </Box>
                    )}
                    {row.phone && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                          Contact
                        </Typography>
                        <Typography variant="body2">{row.phone}</Typography>
                      </Box>
                    )}
                    {row.subscription_package?.name && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                          Subscription
                        </Typography>
                        <Typography variant="body2">{row.subscription_package.name}</Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/edit-business/${row.id}`)}
                      sx={{ flex: 1, textTransform: 'none', backgroundColor: '#1976D2' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleToggleStatus(row.id)}
                      sx={{ 
                        flex: 1, 
                        textTransform: 'none',
                        color: row.is_active == 1 ? '#388E3C' : '#D32F2F',
                        borderColor: row.is_active == 1 ? '#388E3C' : '#D32F2F'
                      }}
                    >
                      {row.is_active == 1 ? 'Deactivate' : 'Activate'}
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(row.id)}
                      sx={{
                        color: '#D32F2F',
                        border: '1px solid #D32F2F',
                        borderRadius: 1,
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">No businesses found</Typography>
            </Box>
          )}
        </Box>

        {/* Pagination */}
        <Divider sx={{ mt: 2 }} />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {pagination.from} to {pagination.to} of {pagination.total} entries
          </Typography>
          {pagination.last_page > 1 && (
            <Pagination
              count={pagination.last_page}
              page={pagination.current_page}
              onChange={handlePageChange}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
              disabled={loading}
            />
          )}
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

      {/* Column Visibility Dialog */}
      <Dialog open={columnVisibilityOpen} onClose={() => setColumnVisibilityOpen(false)}>
        <DialogTitle>Column Visibility</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select which columns to display in the table
          </Typography>
          <Stack spacing={1.5}>
            {[
              { key: 'registeredOn', label: 'Registered On' },
              { key: 'businessName', label: 'Business Name' },
              { key: 'email', label: 'Email' },
              { key: 'contact', label: 'Business Contact' },
              { key: 'status', label: 'Status' },
              { key: 'subscription', label: 'Current Subscription' },
            ].map((column) => (
              <Stack 
                key={column.key}
                direction="row" 
                alignItems="center" 
                spacing={1}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                  p: 1,
                  borderRadius: 1,
                }}
                onClick={() => handleToggleColumn(column.key)}
              >
                <input
                  type="checkbox"
                  checked={visibleColumns[column.key]}
                  onChange={() => handleToggleColumn(column.key)}
                  style={{ cursor: 'pointer' }}
                />
                <Typography>{column.label}</Typography>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColumnVisibilityOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Subscription Management Dialog */}
      <SubscriptionDialog
        open={subscriptionDialog.open}
        onClose={() => setSubscriptionDialog({ open: false, businessId: null, businessName: "" })}
        businessId={subscriptionDialog.businessId}
        businessName={subscriptionDialog.businessName}
        onSuccess={handleSubscriptionSuccess}
      />
    </Box>
  );
}
