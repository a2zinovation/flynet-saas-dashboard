// src/pages/NotificationCenter.jsx
import React, { useState, useMemo } from "react";
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
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

// -----------------------------------------------
// Mock Notification Data
// -----------------------------------------------
const MOCK_NOTIFICATIONS = [
  { id: 1, type: "Alarm", subject: "Face Match Alert", time: "10 min ago", status: "Unread" },
  { id: 2, type: "System", subject: "Subscription expiring soon", time: "1 day ago", status: "Unread" },
  { id: 3, type: "System", subject: "New Feature Rollout", time: "3 days ago", status: "Read" },
];

// Status Chip Color
const statusColor = (s) => {
  if (s === "Unread") return "error";
  if (s === "Read") return "default";
  return "default";
};

export default function NotificationCenter() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");

  // --------------------------------------------------------------
  // FILTER + SEARCH LOGIC
  // --------------------------------------------------------------
  const filteredRows = useMemo(() => {
    return notifications.filter((n) => {
      const s = search.toLowerCase();
      const matchSearch =
        n.subject.toLowerCase().includes(s) ||
        n.type.toLowerCase().includes(s) ||
        n.status.toLowerCase().includes(s);

      const matchStatus = filterStatus === "All" ? true : n.status === filterStatus;
      const matchType = filterType === "All" ? true : n.type === filterType;

      return matchSearch && matchStatus && matchType;
    });
  }, [notifications, search, filterStatus, filterType]);

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

  return (
    <Box>
      {/* ---------------------------------------------- */}
      {/* PAGE TITLE + ACTIONS */}
      {/* ---------------------------------------------- */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="700">
            Notification Center
          </Typography>
          <Typography variant="body2" color="text.secondary">View and manage all system notifications</Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          {selected.length > 0 && (
            <>
              <Button
                startIcon={<MarkEmailReadIcon />}
                variant="contained"
                color="primary"
                size="small"
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Mark as Read
              </Button>

              <Button
                startIcon={<DeleteIcon />}
                variant="contained"
                color="error"
                size="small"
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Delete ({selected.length})
              </Button>
            </>
          )}

          <Button
            startIcon={<FilterListIcon />}
            variant="outlined"
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Filters
          </Button>
        </Stack>
      </Stack>

      {/* ---------------------------------------------- */}
      {/* FILTER PANEL */}
      {/* ---------------------------------------------- */}
      {showFilters && (
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: "#FBFCFE" }}
        >
          <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
            Filters
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {/* Filter By Status */}
            <FormControl size="small">
              <Typography variant="caption">Status</Typography>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Unread">Unread</MenuItem>
                <MenuItem value="Read">Read</MenuItem>
              </Select>
            </FormControl>

            {/* Filter By Type */}
            <FormControl size="small">
              <Typography variant="caption">Type</Typography>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Alarm">Alarm</MenuItem>
                <MenuItem value="System">System</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="contained"
              sx={{ textTransform: "none", borderRadius: 2, backgroundColor: "#0C2548" }}
              onClick={() => setShowFilters(false)}
            >
              Apply
            </Button>
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* TABLE */}
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
              <TableCell>Type</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((n) => {
              const isSelected = selected.includes(n.id);

              return (
                <TableRow
                  key={n.id}
                  hover
                  selected={isSelected}
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleSelect(n.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} />
                  </TableCell>

                  <TableCell>{n.type}</TableCell>
                  <TableCell>{n.subject}</TableCell>
                  <TableCell>{n.time}</TableCell>
                  <TableCell>
                    <Chip
                      label={n.status}
                      color={statusColor(n.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No notifications found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
