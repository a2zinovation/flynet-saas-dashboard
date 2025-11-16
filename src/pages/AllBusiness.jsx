// src/pages/AllBusiness.jsx
import React, { useState, useMemo } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { useNavigate } from "react-router-dom";

/**
 * AllBusiness.jsx
 * - Pixel-aligned toolbar + table matching Figma look-and-feel
 * - Uses mock data (replace with API fetch)
 * - Self-contained and ready to drop into your pages folder
 */

const mockRows = [
  {
    id: "BUS-0001",
    registeredOn: "08/18/2025 18:42",
    businessName: "Manufactures Demo",
    owner: "Mr. Mike Lee",
    email: "manufactorer-demo@demo.com",
    contactNumbers: "C, S, USA · (front of XYZ) Z",
    status: "Active",
    subscription: "10/20/2025 - 11/19/2025",
    createdBy: "Admin",
  },
  {
    id: "BUS-0002",
    registeredOn: "08/19/2025 09:15",
    businessName: "Retail Hub",
    owner: "Ms. Jane Smith",
    email: "jane@retailhub.com",
    contactNumbers: "NY · (Store #12)",
    status: "Active",
    subscription: "03/01/2025 - 03/01/2026",
    createdBy: "Admin",
  },
  {
    id: "BUS-0003",
    registeredOn: "09/02/2025 11:22",
    businessName: "Corner Deli",
    owner: "Mr. David Park",
    email: "david@cornerdeli.com",
    contactNumbers: "CA · (Corner St.)",
    status: "Pending",
    subscription: "—",
    createdBy: "Admin",
  },
];

const statusColor = (s) => {
  if (s === "Active") return "success";
  if (s === "Pending") return "warning";
  if (s === "Inactive") return "default";
  return "default";
};

export default function AllBusiness() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(25);
  const [rows] = useState(mockRows);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [
        r.businessName,
        r.owner,
        r.email,
        r.id,
        r.contactNumbers,
        r.createdBy,
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
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#FBFCFE" }}>
              <TableRow>
                <TableCell sx={{ width: 180 }}>Registered on</TableCell>
                <TableCell>Business Name</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Business contact numbers</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Current Subscription</TableCell>
                <TableCell>Created by</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.slice(0, entries).map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.registeredOn}</TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>{row.businessName}</Typography>
                  </TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.contactNumbers}</TableCell>
                  <TableCell>
                    <Chip label={row.status} color={statusColor(row.status)} size="small" />
                  </TableCell>
                  <TableCell>{row.subscription}</TableCell>
                  <TableCell>{row.createdBy}</TableCell>
                  <TableCell align="center">
                    <Stack direction="column" spacing={0.5} alignItems="flex-end">
                      <Button size="small" variant="outlined" sx={{ textTransform: "none", minWidth: 84 }}>
                        Manage
                      </Button>
                      <Button size="small" variant="contained" color="info" sx={{ textTransform: "none", minWidth: 84 }}>
                        Add Subscription
                      </Button>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" color="error" variant="text" sx={{ textTransform: "none" }}>
                          Deactivate
                        </Button>
                        <Button size="small" variant="text" sx={{ color: "#0C2548", textTransform: "none" }}>
                          Delete
                        </Button>
                      </Stack>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">No businesses found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Pagination placeholder (simple) */}
        <Divider sx={{ mt: 2 }} />
        <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Page 1 of 1
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
