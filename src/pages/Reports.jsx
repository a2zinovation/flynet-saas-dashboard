// src/pages/Reports.jsx
import React, { useState } from "react";
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
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function Reports() {
  const [entries, setEntries] = useState(25);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const mockReports = [
    {
      id: 1,
      date: "08/18/2025 09:15",
      user: "Admin",
      category: "Business",
      action: "Created Subscription",
      detail: "Subscription created for Demo Business",
    },
    {
      id: 2,
      date: "08/22/2025 12:30",
      user: "Super Admin",
      category: "Package",
      action: "Package Updated",
      detail: "Regular package was updated",
    },
    {
      id: 3,
      date: "09/03/2025 14:10",
      user: "Admin",
      category: "Settings",
      action: "SMTP Updated",
      detail: "Email settings configured",
    },
  ];

  const filteredReports = mockReports.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Page Title */}
      <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
        Reports
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View system activity logs & audits
      </Typography>

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

            {/* Export buttons */}
            <Button
              startIcon={<FileDownloadIcon />}
              size="small"
              sx={{ textTransform: "none" }}
            >
              Export CSV
            </Button>

            <Button startIcon={<PrintIcon />} size="small" sx={{ textTransform: "none" }}>
              Print
            </Button>

            <Button
              startIcon={<FilterListIcon />}
              size="small"
              onClick={() => setFilterOpen(!filterOpen)}
              sx={{ textTransform: "none" }}
            >
              Filters
            </Button>
          </Stack>

          {/* Right side: Search */}
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
        </Stack>

        {/* FILTER PANEL */}
        {filterOpen && (
          <Paper
            variant="outlined"
            sx={{ p: 2, mb: 2, borderRadius: 1, backgroundColor: "#F8FAFC" }}
          >
            <Typography variant="body2">Filters section — Add conditions here</Typography>
          </Paper>
        )}

        {/* TABLE */}
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#FBFCFE" }}>
            <TableRow>
              <TableCell sx={{ width: 180 }}>Date</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredReports.slice(0, entries).map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.user}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.action}</TableCell>
                <TableCell>{row.detail}</TableCell>
              </TableRow>
            ))}

            {filteredReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No reports found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* FOOTER (pagination placeholder) */}
        <Divider sx={{ mt: 2 }} />

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
          <Typography variant="body2">Page 1 of 1</Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
