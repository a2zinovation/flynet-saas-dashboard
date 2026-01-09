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
  TableContainer,
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
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import reportService from "../services/reportService";

export default function Reports() {
  const [entries, setEntries] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
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
  const [allReports, setAllReports] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({
    category: "",
    action: "",
    date_from: "",
    date_to: "",
  });

  // Fetch reports when page, entries, or applied filters change
  useEffect(() => {
    fetchReports();
  }, [currentPage, entries, appliedFilters.category, appliedFilters.action, appliedFilters.date_from, appliedFilters.date_to, appliedFilters.search]);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    
    // Build query parameters for server-side pagination and filtering
    const params = {
      page: currentPage,
      per_page: entries,
    };

    // Add search parameter
    if (appliedFilters.search && appliedFilters.search.trim()) {
      params.search = appliedFilters.search.trim();
    }

    // Add applied filters if present
    if (appliedFilters.category) {
      params.category = appliedFilters.category;
    }
    if (appliedFilters.action) {
      params.action = appliedFilters.action;
    }
    if (appliedFilters.date_from) {
      params.date_from = appliedFilters.date_from;
    }
    if (appliedFilters.date_to) {
      params.date_to = appliedFilters.date_to;
    }
    
    const result = await reportService.getAll(params);
    
    if (result.success) {
      // reportService returns { success, data, pagination, message }
      const records = result.data || [];
      setReports(records);
      setAllReports(records);
      
      // Use pagination from service if available, otherwise calculate from response
      if (result.pagination) {
        // Backend provided pagination metadata
        setPagination({
          current_page: result.pagination.current_page || 1,
          last_page: result.pagination.last_page || 1,
          per_page: result.pagination.per_page || entries,
          total: result.pagination.total || 0,
          from: result.pagination.from || (records.length > 0 ? 1 : 0),
          to: result.pagination.to || records.length,
        });
      } else if (Array.isArray(records)) {
        // Fallback for non-paginated response
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: entries,
          total: records.length,
          from: records.length > 0 ? 1 : 0,
          to: records.length,
        });
      }
    } else {
      setError(result.message || "Failed to load reports");
      setReports([]);
      setAllReports([]);
      setPagination({
        current_page: 1,
        last_page: 1,
        per_page: entries,
        total: 0,
        from: 0,
        to: 0,
      });
    }
    setLoading(false);
  };

  // Extract unique categories and actions from current page data
  const filterOptions = React.useMemo(() => {
    const categories = [...new Set(allReports.map(r => r.category).filter(Boolean))];
    const actions = [...new Set(allReports.map(r => r.action).filter(Boolean))];
    return { categories, actions };
  }, [allReports]);

  // Apply filters and trigger server-side fetch
  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1); // Reset to first page when applying filters
    setFilterOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      category: "",
      action: "",
      date_from: "",
      date_to: "",
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const headers = ['Date & Time', 'User', 'Category', 'Action', 'Details', 'IP Address'];
      const csvData = reports.map(row => [
        formatDate(row.created_at || row.date),
        row.user_name || row.user || 'System',
        row.category || 'General',
        row.action || '',
        row.description || row.detail || row.details || 'N/A',
        row.ip_address || 'N/A',
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      setSuccess("CSV exported successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to export CSV");
    }
    setExporting(false);
  };

  const handleExportExcel = () => {
    setExporting(true);
    try {
      const headers = ['Date & Time', 'User', 'Category', 'Action', 'Details', 'IP Address'];
      
      let htmlTable = '<table border="1"><thead><tr>';
      headers.forEach(header => {
        htmlTable += `<th>${header}</th>`;
      });
      htmlTable += '</tr></thead><tbody>';

      reports.forEach(row => {
        htmlTable += '<tr>';
        htmlTable += `<td>${formatDate(row.created_at || row.date)}</td>`;
        htmlTable += `<td>${row.user_name || row.user || 'System'}</td>`;
        htmlTable += `<td>${row.category || 'General'}</td>`;
        htmlTable += `<td>${row.action || ''}</td>`;
        htmlTable += `<td>${row.description || row.detail || row.details || 'N/A'}</td>`;
        htmlTable += `<td>${row.ip_address || 'N/A'}</td>`;
        htmlTable += '</tr>';
      });

      htmlTable += '</tbody></table>';

      const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `activity_logs_${new Date().toISOString().split('T')[0]}.xls`;
      link.click();

      setSuccess("Excel exported successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to export Excel");
    }
    setExporting(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Activity Logs Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0C2548; text-align: center; margin-bottom: 10px; }
            h2 { color: #666; text-align: center; font-size: 14px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #0C2548; color: white; padding: 10px; text-align: left; font-size: 12px; }
            td { padding: 8px; border-bottom: 1px solid #ddd; font-size: 11px; }
            tr:hover { background-color: #f5f5f5; }
            .timestamp { text-align: center; margin-top: 20px; font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Activity Logs Report</h1>
          <h2>Generated on ${new Date().toLocaleString()}</h2>
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>User</th>
                <th>Category</th>
                <th>Action</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              ${reports.map(row => `
                <tr>
                  <td>${formatDate(row.created_at || row.date)}</td>
                  <td>${row.user_name || row.user || 'System'}</td>
                  <td>${row.category || 'General'}</td>
                  <td>${row.action || ''}</td>
                  <td>${row.description || row.detail || row.details || 'N/A'}</td>
                  <td>${row.ip_address || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="timestamp">
            Total Entries: ${pagination.total} (Showing current page)
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleEntriesChange = (e) => {
    const newEntries = Number(e.target.value);
    setEntries(newEntries);
    setCurrentPage(1); // Reset to first page and trigger refetch
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // This will trigger useEffect to fetch new page
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
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
        Activity Logs
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
          p: { xs: 1, sm: 2 },
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
              startIcon={exporting ? <CircularProgress size={16} /> : <DescriptionOutlinedIcon />}
              size="small"
              onClick={handleExportExcel}
              disabled={loading || exporting}
              sx={{ textTransform: "none" }}
            >
              Export Excel
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
            value={appliedFilters.search || ""}
            onChange={(e) => {
              const newFilters = { ...appliedFilters, search: e.target.value };
              setAppliedFilters(newFilters);
              if (e.target.value === "") {
                setCurrentPage(1);
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setCurrentPage(1);
              }
            }}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: appliedFilters.search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => {
                    setAppliedFilters({ ...appliedFilters, search: "" });
                    setCurrentPage(1);
                  }}>
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
                onClick={handleApplyFilters}
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Desktop Table View */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <TableContainer
                sx={{
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  width: '100%',
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
                    '&:hover': {
                      backgroundColor: '#7a7a7a',
                    },
                  },
                }}
              >
                <Table size="small" sx={{ minWidth: 1000 }}>
                  <TableHead sx={{ backgroundColor: "#FBFCFE" }}>
                    <TableRow>
                      <TableCell sx={{ minWidth: 160, fontWeight: 600 }}>Date & Time</TableCell>
                      <TableCell sx={{ minWidth: 120, fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ minWidth: 100, fontWeight: 600 }}>Category</TableCell>
                      <TableCell sx={{ minWidth: 130, fontWeight: 600 }}>Action</TableCell>
                      <TableCell sx={{ minWidth: 200, fontWeight: 600 }}>Details</TableCell>
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
              </TableContainer>
            </Box>

            {/* Mobile Card View */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              {reports.length > 0 ? (
                <Stack spacing={2}>
                  {reports.map((row) => (
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
                      {/* Header: User + Category */}
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {row.user_name || row.user || "System"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(row.created_at || row.date)}
                          </Typography>
                        </Box>
                        <Chip 
                          label={row.category || "General"} 
                          size="small" 
                          color={getCategoryColor(row.category)}
                          sx={{ flexShrink: 0, ml: 1 }}
                        />
                      </Stack>

                      {/* Action */}
                      {row.action && (
                        <Box sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid #E8EDF2' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Action
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {row.action}
                          </Typography>
                        </Box>
                      )}

                      {/* Details */}
                      {(row.description || row.detail || row.details) && (
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Details
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {row.description || row.detail || row.details}
                          </Typography>
                          {row.model_type && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {row.model_type} #{row.model_id}
                            </Typography>
                          )}
                        </Box>
                      )}

                      {/* Footer: Email + IP */}
                      {(row.user_email || row.ip_address) && (
                        <Stack spacing={0.5} sx={{ pt: 1, borderTop: '1px solid #E8EDF2', fontSize: '0.75rem' }}>
                          {row.user_email && (
                            <Typography variant="caption" color="text.secondary">
                              <strong>Email:</strong> {row.user_email}
                            </Typography>
                          )}
                          {row.ip_address && (
                            <Typography variant="caption" color="text.secondary">
                              <strong>IP:</strong> {row.ip_address}
                            </Typography>
                          )}
                        </Stack>
                      )}
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary">
                    No activity logs found
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              )}
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
                {pagination.total > 0 
                  ? `Showing ${pagination.from || 0} to ${pagination.to || 0} of ${pagination.total} entries`
                  : 'No entries to display'
                }
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
          </>
        )}
      </Paper>
    </Box>
  );
}
