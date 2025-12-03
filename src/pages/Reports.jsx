// src/pages/Reports.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
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
  Divider,
  CircularProgress,
  Alert,
  Pagination,
  Chip,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClearIcon from "@mui/icons-material/Clear";
import reportService from "../services/reportService";

export default function Reports() {
  const [entries, setEntries] = useState(25);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 25,
    total: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    action: "",
    date_from: "",
    date_to: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    actions: [],
  });

  useEffect(() => {
    fetchReports();
    fetchFilterOptions();
  }, [pagination.current_page, entries]);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    
    const params = {
      page: pagination.current_page,
      per_page: entries,
      search: search,
      ...filters,
    };

    const result = await reportService.getAll(params);
    
    if (result.success) {
      setReports(result.data);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } else {
      setError(result.message || "Failed to load reports");
    }
    setLoading(false);
  };

  const fetchFilterOptions = async () => {
    const result = await reportService.getFilterOptions();
    if (result.success) {
      setFilterOptions(result.data);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current_page: 1 });
    fetchReports();
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilters({
      category: "",
      action: "",
      date_from: "",
      date_to: "",
    });
    setPagination({ ...pagination, current_page: 1 });
    setTimeout(fetchReports, 100);
  };

  const handleExportCSV = async () => {
    setExporting(true);
    setError("");
    setSuccess("");

    const params = {
      search: search,
      ...filters,
    };

    const result = await reportService.exportCSV(params);
    
    if (result.success) {
      setSuccess("CSV exported successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to export CSV");
    }
    setExporting(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePageChange = (event, value) => {
    setPagination({ ...pagination, current_page: value });
  };

  const handleEntriesChange = (e) => {
    setEntries(Number(e.target.value));
    setPagination({ ...pagination, current_page: 1 });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Business': 'primary',
      'Package': 'secondary',
      'User': 'success',
      'Settings': 'warning',
      'Auth': 'info',
      'System': 'default',
    };
    return colors[category] || 'default';
  };

  return (
    <Box>
      {/* Page Title */}
      <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
        Reports & Activity Logs
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Track all system activities across SaaS Dashboard and VMS (Video Management System)
      </Typography>

      {/* Alerts */}
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

      {/* Report Container */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid #E8EDF2",
        }}
      >
        {/* TOP TOOLBAR */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2 }}
        >
          {/* Left side: Entries + Export */}
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="body2">Show</Typography>

            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={entries}
                onChange={handleEntriesChange}
                size="small"
                disabled={loading}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="body2">entries</Typography>

            {/* Export buttons */}
            <Button
              startIcon={exporting ? <CircularProgress size={16} /> : <FileDownloadIcon />}
              size="small"
              onClick={handleExportCSV}
              disabled={loading || exporting}
              sx={{ textTransform: "none" }}
            >
              Export CSV
            </Button>

            <Button 
              startIcon={<PrintIcon />} 
              size="small" 
              onClick={handlePrint}
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              Print
            </Button>

            <Button
              startIcon={<FilterListIcon />}
              size="small"
              onClick={() => setFilterOpen(!filterOpen)}
              variant={filterOpen ? "contained" : "outlined"}
              sx={{ textTransform: "none" }}
            >
              Filters
            </Button>

            <Tooltip title="Refresh">
              <IconButton size="small" onClick={fetchReports} disabled={loading}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Right side: Search */}
          <TextField
            size="small"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearFilters}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
        </Stack>

        {/* FILTER PANEL */}
        {filterOpen && (
          <Paper
            variant="outlined"
            sx={{ p: 2, mb: 2, borderRadius: 1, backgroundColor: "#F8FAFC" }}
          >
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Advanced Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <Typography variant="caption" sx={{ mb: 0.5 }}>Category</Typography>
                  <Select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    displayEmpty
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {filterOptions.categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <Typography variant="caption" sx={{ mb: 0.5 }}>Action</Typography>
                  <Select
                    value={filters.action}
                    onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                    displayEmpty
                  >
                    <MenuItem value="">All Actions</MenuItem>
                    {filterOptions.actions.map((action) => (
                      <MenuItem key={action} value={action}>{action}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>From Date</Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>To Date</Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleSearch}
                disabled={loading}
                sx={{ textTransform: "none" }}
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearFilters}
                disabled={loading}
                sx={{ textTransform: "none" }}
              >
                Clear All
              </Button>
            </Stack>
          </Paper>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* TABLE */}
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#FBFCFE" }}>
                  <TableRow>
                    <TableCell sx={{ minWidth: 180, fontWeight: 600 }}>Date & Time</TableCell>
                    <TableCell sx={{ minWidth: 120, fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ minWidth: 100, fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ minWidth: 150, fontWeight: 600 }}>Action</TableCell>
                    <TableCell sx={{ minWidth: 250, fontWeight: 600 }}>Details</TableCell>
                    <TableCell sx={{ minWidth: 100, fontWeight: 600 }}>IP Address</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {reports.length > 0 ? (
                    reports.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{formatDate(row.created_at || row.date)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {row.user_name || row.user || "System"}
                          </Typography>
                          {row.user_email && (
                            <Typography variant="caption" color="text.secondary">
                              {row.user_email}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={row.category || "General"} 
                            size="small" 
                            color={getCategoryColor(row.category)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {row.action}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {row.description || row.detail || row.details || "N/A"}
                          </Typography>
                          {row.model_type && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {row.model_type} #{row.model_id}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {row.ip_address || "N/A"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">
                          No activity logs found
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Try adjusting your search or filters
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>

            {/* FOOTER - Pagination */}
            <Divider sx={{ mt: 2 }} />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} entries
              </Typography>

              {pagination.last_page > 1 && (
                <Pagination
                  count={pagination.last_page}
                  page={pagination.current_page}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                />
              )}
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
}
