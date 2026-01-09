import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Skeleton,
  Alert,
  CircularProgress,
  LinearProgress,
} from "@mui/material";

// Icons
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import reportService from "../services/reportService";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [packageIncome, setPackageIncome] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSummary();
    loadPackageIncome();
  }, []);

  const loadSummary = async () => {
    setLoadingSummary(true);
    const result = await reportService.getSummary();
    if (result.success) {
      setSummary(result.data || null);
    } else {
      setError(result.message || "Failed to load summary");
      setSummary(null);
    }
    setLoadingSummary(false);
  };

  const loadPackageIncome = async () => {
    setLoadingPackages(true);
    const result = await reportService.getPackageIncome();
    if (result.success) {
      setPackageIncome(result.data || []);
    } else {
      setError(result.message || "Failed to load package income");
      setPackageIncome([]);
    }
    setLoadingPackages(false);
  };

  const kpis = useMemo(() => {
    return [
      {
        label: "Registered Businesses",
        value: summary?.registered_businesses,
        icon: <BusinessIcon />,
        color: "#1E3A8A",
      },
      {
        label: "Active Businesses",
        value: summary?.active_businesses,
        icon: <CheckCircleIcon />,
        color: "#10B981",
      },
      {
        label: "Inactive Businesses",
        value: summary?.inactive_businesses,
        icon: <BlockIcon />,
        color: "#EF4444",
      },
      {
        label: "Total Income",
        value: summary?.total_income,
        icon: <AttachMoneyIcon />,
        color: "#22C55E",
      },
      {
        label: "Total Cameras",
        value: summary?.total_cameras,
        icon: <CameraAltIcon />,
        color: "#14B8A6",
      },
    ];
  }, [summary]);

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, pb: 4 }}>
      {/* PAGE TITLE */}
      <Typography
        sx={{
          fontSize: { xs: 18, sm: 22 },
          fontWeight: 700,
          color: "#0C2548",
          mb: 2,
        }}
      >
        Reports
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* KPI CARDS */}
      <Grid container spacing={2}>
        {kpis.map((kpi, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={kpi.label}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 2,
                border: "1px solid #E8EDF2",
                display: "flex",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: 56,
                  bgcolor: kpi.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                {kpi.icon}
              </Box>

              <Box sx={{ p: 2, width: "100%" }}>
                <Typography variant="body2" sx={{ color: "#6B7280", mb: 0.5 }}>
                  {kpi.label}
                </Typography>

                {loadingSummary ? (
                  <Skeleton width={80} height={24} />
                ) : (
                  <Typography
                    sx={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#0C2548",
                    }}
                  >
                    {kpi.value ?? "-"}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* STATISTICS SECTION */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          borderRadius: 2,
          border: "1px solid #E8EDF2",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography fontWeight={600}>Statistics</Typography>
        </Box>

        <Divider />

        <Grid container>
          {/* LEFT — CHART SKELETONS */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              p: 2,
              borderRight: { md: "1px solid #E8EDF2" },
            }}
          >
            <Typography fontWeight={600} sx={{ mb: 2 }}>
              Business & Camera Statistics
            </Typography>

            {loadingSummary ? (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  bgcolor: "#F8FAFC",
                  p: 2,
                }}
              >
                <Grid container spacing={3}>
                  {/* DONUT PLACEHOLDER */}
                  <Grid item xs={12} sm={6}>
                    <Stack alignItems="center" spacing={1}>
                      <Skeleton
                        variant="circular"
                        width={120}
                        height={120}
                      />
                      <Skeleton width={120} height={16} />
                      <Skeleton width={80} height={14} />
                    </Stack>
                  </Grid>

                  {/* SECOND DONUT PLACEHOLDER */}
                  <Grid item xs={12} sm={6}>
                    <Stack alignItems="center" spacing={1}>
                      <Skeleton
                        variant="circular"
                        width={120}
                        height={120}
                      />
                      <Skeleton width={120} height={16} />
                      <Skeleton width={80} height={14} />
                    </Stack>
                  </Grid>

                  {/* BAR CHART PLACEHOLDER */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton
                          key={i}
                          variant="rectangular"
                          height={12}
                          sx={{ borderRadius: 1 }}
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    color: "#94A3B8",
                    mt: 2,
                  }}
                >
                  Loading charts...
                </Typography>
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  bgcolor: "#F8FAFC",
                  p: 2,
                }}
              >
                <Grid container spacing={3}>
                  {/* BUSINESS STATUS DONUT */}
                  <Grid item xs={12} sm={6}>
                    <Stack alignItems="center" spacing={1}>
                      <Box sx={{ position: 'relative', width: 140, height: 140 }}>
                        <svg width="140" height="140" viewBox="0 0 140 140">
                          {/* Background circle */}
                          <circle
                            cx="70"
                            cy="70"
                            r="50"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="20"
                          />
                          {/* Active businesses arc */}
                          <circle
                            cx="70"
                            cy="70"
                            r="50"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="20"
                            strokeDasharray={`${((summary?.active_businesses || 0) / (summary?.registered_businesses || 1)) * 314} 314`}
                            strokeDashoffset="0"
                            transform="rotate(-90 70 70)"
                            strokeLinecap="round"
                          />
                          {/* Inactive businesses arc */}
                          <circle
                            cx="70"
                            cy="70"
                            r="50"
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="20"
                            strokeDasharray={`${((summary?.inactive_businesses || 0) / (summary?.registered_businesses || 1)) * 314} 314`}
                            strokeDashoffset={`-${((summary?.active_businesses || 0) / (summary?.registered_businesses || 1)) * 314}`}
                            transform="rotate(-90 70 70)"
                            strokeLinecap="round"
                          />
                          {/* Center text */}
                          <text
                            x="70"
                            y="70"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="24"
                            fontWeight="700"
                            fill="#0C2548"
                          >
                            {summary?.registered_businesses || 0}
                          </text>
                          <text
                            x="70"
                            y="88"
                            textAnchor="middle"
                            fontSize="10"
                            fill="#6B7280"
                          >
                            Total
                          </text>
                        </svg>
                      </Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Business Status
                      </Typography>
                      <Stack spacing={0.5} sx={{ width: '100%' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ width: 12, height: 12, bgcolor: '#10B981', borderRadius: '50%' }} />
                          <Typography variant="caption" color="text.secondary">
                            Active: {summary?.active_businesses || 0}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ width: 12, height: 12, bgcolor: '#EF4444', borderRadius: '50%' }} />
                          <Typography variant="caption" color="text.secondary">
                            Inactive: {summary?.inactive_businesses || 0}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>

                  {/* CAMERA METRICS */}
                  <Grid item xs={12} sm={6}>
                    <Stack alignItems="center" spacing={1}>
                      <Box sx={{ position: 'relative', width: 140, height: 140 }}>
                        <svg width="140" height="140" viewBox="0 0 140 140">
                          {/* Background circle */}
                          <circle
                            cx="70"
                            cy="70"
                            r="50"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="20"
                          />
                          {/* Cameras arc */}
                          <circle
                            cx="70"
                            cy="70"
                            r="50"
                            fill="none"
                            stroke="#14B8A6"
                            strokeWidth="20"
                            strokeDasharray="314 314"
                            strokeDashoffset="0"
                            transform="rotate(-90 70 70)"
                            strokeLinecap="round"
                          />
                          {/* Center text */}
                          <text
                            x="70"
                            y="70"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="24"
                            fontWeight="700"
                            fill="#0C2548"
                          >
                            {summary?.total_cameras || 0}
                          </text>
                          <text
                            x="70"
                            y="88"
                            textAnchor="middle"
                            fontSize="10"
                            fill="#6B7280"
                          >
                            Cameras
                          </text>
                        </svg>
                      </Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Total Cameras
                      </Typography>
                      <Typography variant="caption" color="text.secondary" textAlign="center">
                        {summary?.active_businesses > 0 
                          ? `Avg: ${Math.round((summary?.total_cameras || 0) / summary?.active_businesses)} per business`
                          : 'No active businesses'}
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* BAR CHART - Business Distribution */}
                  <Grid item xs={12}>
                    <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                      Business Metrics Overview
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Total Registered
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {summary?.registered_businesses || 0}
                          </Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={100} 
                          sx={{ 
                            height: 10, 
                            borderRadius: 1,
                            bgcolor: '#E5E7EB',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#1E3A8A',
                            }
                          }} 
                        />
                      </Box>

                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Active Businesses
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {summary?.active_businesses || 0} ({summary?.registered_businesses > 0 ? Math.round((summary?.active_businesses / summary?.registered_businesses) * 100) : 0}%)
                          </Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={(summary?.active_businesses || 0) / (summary?.registered_businesses || 1) * 100} 
                          sx={{ 
                            height: 10, 
                            borderRadius: 1,
                            bgcolor: '#E5E7EB',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#10B981',
                            }
                          }} 
                        />
                      </Box>

                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Inactive Businesses
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {summary?.inactive_businesses || 0} ({summary?.registered_businesses > 0 ? Math.round((summary?.inactive_businesses / summary?.registered_businesses) * 100) : 0}%)
                          </Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={(summary?.inactive_businesses || 0) / (summary?.registered_businesses || 1) * 100} 
                          sx={{ 
                            height: 10, 
                            borderRadius: 1,
                            bgcolor: '#E5E7EB',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#EF4444',
                            }
                          }} 
                        />
                      </Box>

                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Total Cameras Deployed
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {summary?.total_cameras || 0}
                          </Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={summary?.total_cameras > 0 ? 100 : 0} 
                          sx={{ 
                            height: 10, 
                            borderRadius: 1,
                            bgcolor: '#E5E7EB',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#14B8A6',
                            }
                          }} 
                        />
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Grid>

          {/* RIGHT — PACKAGE TABLE */}
          <Grid item xs={12} md={6} sx={{ p: 2 }}>
            <Typography fontWeight={600} sx={{ mb: 2 }}>
              Package-Wise Income
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Package Name</TableCell>
                    <TableCell align="center">Active Businesses</TableCell>
                    <TableCell align="right">Total Income</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loadingPackages
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <TableRow key={`skeleton-${i}`}>
                          <TableCell><Skeleton width={120} /></TableCell>
                          <TableCell align="center"><Skeleton width={60} /></TableCell>
                          <TableCell align="right"><Skeleton width={80} /></TableCell>
                        </TableRow>
                      ))
                    : packageIncome.map((row, i) => (
                        <TableRow key={`${row.name}-${i}`}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell align="center">{row.businesses}</TableCell>
                          <TableCell align="right">{row.income}</TableCell>
                        </TableRow>
                      ))}

                  {!loadingPackages && packageIncome.length > 0 && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        {packageIncome.reduce((sum, row) => sum + Number(row.businesses || 0), 0)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {packageIncome.reduce((sum, row) => sum + Number((row.income_numeric ?? row.income) || 0), 0)}
                      </TableCell>
                    </TableRow>
                  )}

                  {!loadingPackages && packageIncome.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography color="text.secondary">No data available</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
