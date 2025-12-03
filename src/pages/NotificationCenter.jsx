// src/pages/NotificationCenter.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Checkbox,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import VisibilityIcon from "@mui/icons-material/Visibility";
import notificationService from "../services/notificationService";

// Status Chip Color
const statusColor = (s) => {
  const status = s?.toLowerCase();
  if (status === "unread") return "error";
  if (status === "read") return "default";
  return "default";
};

const typeColor = (t) => {
  const type = t?.toLowerCase();
  if (type === "alarm" || type === "alert") return "error";
  if (type === "warning") return "warning";
  if (type === "system") return "info";
  if (type === "message") return "primary";
  return "default";
};

export default function NotificationCenter() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 25,
    total: 0,
  });
  const [viewDialog, setViewDialog] = useState({ open: false, notification: null });

  useEffect(() => {
    fetchNotifications();
  }, [pagination.current_page, filterStatus, filterType]);

  // Fetch unread count on mount to update badge
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    const result = await notificationService.getUnreadCount();
    if (result.success) {
      setUnreadCount(result.count);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");

    const params = {
      page: pagination.current_page,
      per_page: pagination.per_page,
      search: search,
      status: filterStatus === "all" ? "" : filterStatus,
      type: filterType === "all" ? "" : filterType,
    };

    const result = await notificationService.getAll(params);

    if (result.success) {
      setNotifications(result.data);
      setUnreadCount(result.unread_count || 0);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } else {
      setError(result.message || "Failed to load notifications");
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current_page: 1 });
    fetchNotifications();
  };

  // --------------------------------------------------------------
  // FILTER + SEARCH LOGIC (for local filtering if needed)
  // --------------------------------------------------------------
  const filteredRows = useMemo(() => {
    return notifications.filter((n) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        n.subject?.toLowerCase().includes(s) ||
        n.type?.toLowerCase().includes(s) ||
        n.message?.toLowerCase().includes(s)
      );
    });
  }, [notifications, search]);

  // --------------------------------------------------------------
  // BULK SELECT
  // --------------------------------------------------------------
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredRows.map((n) => n.id));
    } else setSelected([]);
  };

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleMarkAsRead = async () => {
    if (selected.length === 0) return;

    const result = await notificationService.markAsRead(selected);

    if (result.success) {
      setSuccess(`${selected.length} notification(s) marked as read`);
      setSelected([]);
      fetchNotifications();
      fetchUnreadCount(); // Update badge count
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await notificationService.markAllAsRead();

    if (result.success) {
      setSuccess("All notifications marked as read");
      fetchNotifications();
      fetchUnreadCount(); // Update badge count
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to mark all as read");
    }
  };

  const handleDelete = async () => {
    if (selected.length === 0) return;

    if (!window.confirm(`Delete ${selected.length} notification(s)?`)) {
      return;
    }

    const result = await notificationService.delete(selected);

    if (result.success) {
      setSuccess(`${selected.length} notification(s) deleted`);
      setSelected([]);
      fetchNotifications();
      fetchUnreadCount(); // Update badge count
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to delete notifications");
    }
  };

  const handleViewNotification = async (notification) => {
    setViewDialog({ open: true, notification });

    // Mark as read when viewing
    if (notification.status?.toLowerCase() === "unread" || !notification.read_at) {
      await notificationService.markAsRead(notification.id);
      fetchNotifications();
      fetchUnreadCount(); // Update badge count
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box>
      {/* ---------------------------------------------- */}
      {/* PAGE TITLE + ACTIONS */}
      {/* ---------------------------------------------- */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h5" fontWeight="700">
              Notification Center
            </Typography>
            {unreadCount > 0 && (
              <Badge badgeContent={unreadCount} color="error">
                <Chip label="Unread" color="error" size="small" />
              </Badge>
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            View and manage all system notifications and messages
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {selected.length > 0 && (
            <>
              <Button
                startIcon={<MarkEmailReadIcon />}
                variant="contained"
                color="primary"
                size="small"
                onClick={handleMarkAsRead}
                disabled={loading}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Mark as Read
              </Button>

              <Button
                startIcon={<DeleteIcon />}
                variant="contained"
                color="error"
                size="small"
                onClick={handleDelete}
                disabled={loading}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Delete ({selected.length})
              </Button>
            </>
          )}

          {unreadCount > 0 && (
            <Button
              startIcon={<ClearAllIcon />}
              variant="outlined"
              size="small"
              onClick={handleMarkAllAsRead}
              disabled={loading}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Mark All Read
            </Button>
          )}

          <Button
            startIcon={<FilterListIcon />}
            variant={showFilters ? "contained" : "outlined"}
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Filters
          </Button>

          <Tooltip title="Refresh">
            <IconButton size="small" onClick={fetchNotifications} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

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

      {/* ---------------------------------------------- */}
      {/* FILTER PANEL */}
      {/* ---------------------------------------------- */}
      {showFilters && (
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: "#FBFCFE" }}
        >
          <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
            Advanced Filters
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {/* Filter By Status */}
            <FormControl size="small" fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5 }}>Status</Typography>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
                <MenuItem value="read">Read</MenuItem>
              </Select>
            </FormControl>

            {/* Filter By Type */}
            <FormControl size="small" fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5 }}>Type</Typography>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="alarm">Alarm</MenuItem>
                <MenuItem value="alert">Alert</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="system">System</MenuItem>
                <MenuItem value="message">Message</MenuItem>
                <MenuItem value="info">Info</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" spacing={1} alignItems="flex-end">
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setPagination({ ...pagination, current_page: 1 });
                  fetchNotifications();
                }}
                disabled={loading}
                sx={{ textTransform: "none", borderRadius: 2, backgroundColor: "#0C2548" }}
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setFilterStatus("all");
                  setFilterType("all");
                  setSearch("");
                  setPagination({ ...pagination, current_page: 1 });
                  setTimeout(fetchNotifications, 100);
                }}
                disabled={loading}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Clear
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* ---------------------------------------------- */}
      {/* SEARCH + TABLE */}
      {/* ---------------------------------------------- */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #E8EDF2" }}>
        {/* Search */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* TABLE */}
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#FBFCFE" }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selected.length > 0 && selected.length < filteredRows.length
                        }
                        checked={
                          filteredRows.length > 0 &&
                          selected.length === filteredRows.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 250 }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredRows.length > 0 ? (
                    filteredRows.map((n) => {
                      const isSelected = selected.includes(n.id);
                      const isUnread = n.status?.toLowerCase() === "unread" || !n.read_at;

                      return (
                        <TableRow
                          key={n.id}
                          hover
                          selected={isSelected}
                          sx={{ 
                            cursor: "pointer",
                            backgroundColor: isUnread ? 'rgba(25, 118, 210, 0.04)' : 'inherit'
                          }}
                        >
                          <TableCell padding="checkbox" onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(n.id);
                          }}>
                            <Checkbox checked={isSelected} />
                          </TableCell>

                          <TableCell onClick={() => handleViewNotification(n)}>
                            <Chip
                              label={n.type || "Info"}
                              color={typeColor(n.type)}
                              size="small"
                            />
                          </TableCell>

                          <TableCell onClick={() => handleViewNotification(n)}>
                            <Typography 
                              variant="body2" 
                              fontWeight={isUnread ? 600 : 400}
                            >
                              {n.subject || "No Subject"}
                            </Typography>
                            {n.message && (
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {n.message.replace(/<[^>]*>/g, '')}
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell onClick={() => handleViewNotification(n)}>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(n.created_at || n.time)}
                            </Typography>
                          </TableCell>

                          <TableCell onClick={() => handleViewNotification(n)}>
                            <Chip
                              label={isUnread ? "Unread" : "Read"}
                              color={statusColor(isUnread ? "Unread" : "Read")}
                              size="small"
                            />
                          </TableCell>

                          <TableCell>
                            <Stack direction="row" spacing={0.5}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewNotification(n)}
                                  color="primary"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">
                          No notifications found
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

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} notifications
                </Typography>
                <Pagination
                  count={pagination.last_page}
                  page={pagination.current_page}
                  onChange={(e, page) => setPagination({ ...pagination, current_page: page })}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* View Notification Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, notification: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="600">
              {viewDialog.notification?.subject || "Notification"}
            </Typography>
            <Chip
              label={viewDialog.notification?.type || "Info"}
              color={typeColor(viewDialog.notification?.type)}
              size="small"
            />
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            {formatDate(viewDialog.notification?.created_at)}
          </Typography>
          <Box
            dangerouslySetInnerHTML={{ 
              __html: viewDialog.notification?.message || 'No message content' 
            }}
            sx={{
              '& p': { mb: 1 },
              '& ul, & ol': { pl: 3 }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, notification: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
