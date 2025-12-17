// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  useTheme,
  ButtonBase,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import dashboardService from "../services/dashboardService";
import cameraService from "../services/cameraService";

/**
 * Dashboard with responsive, clickable Stat Cards
 */

const getStatsConfig = (data) => [
  {
    id: "all-business",
    label: "All Business",
    value: data?.total_businesses || 0,
    icon: "/assets/icons/business.svg",
    route: "/all-business",
  },
  {
    id: "pending",
    label: "In-active Businesses",
    value: data?.pending_businesses || 0,
    icon: "/assets/icons/pending.svg",
    route: "/all-business?filter=pending",
  },
  {
    id: "due",
    label: "Notifications",
    value: data?.notifications || 0,
    icon: "/assets/icons/payment.svg",
    route: "/notification-center",
  },
  {
    id: "profit",
    label: "Reports",
    value: 0,
    icon: "/assets/icons/profit.svg",
    valueColor: "#17A34A",
    route: "/reports",
  },
];

function StatCard({ stat }) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <ButtonBase
      onClick={() => navigate(stat.route)}
      sx={{
        width: "100%",
        textAlign: "left",
        borderRadius: 2,
        display: "block",
      }}
      disableRipple
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 2,
          border: "1px solid rgba(14, 30, 37, 0.06)",
          minHeight: { xs: 80, sm: 96 },
          width: "100%",
          display: "flex",
          alignItems: "center",
          transition: "all 0.2s ease",
          cursor: "pointer",

          "&:hover": {
            borderColor: "#0C2548",
            backgroundColor: "rgba(12,37,72,0.04)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.background.default,
              border: "1px solid rgba(14,30,37,0.03)",
            }}
          >
            <img
              src={stat.icon}
              alt={stat.label}
              style={{ width: 26, height: 26, objectFit: "contain" }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {stat.label}
            </Typography>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                color: stat.valueColor
                  ? stat.valueColor
                  : theme.palette.text.primary,
                mt: 0.5,
              }}
            >
              {stat.value}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </ButtonBase>
  );
}

export default function Dashboard() {
  const theme = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapComponents, setMapComponents] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard stats and cameras
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    
    // Fetch stats
    const statsResult = await dashboardService.getStats();
    if (statsResult.success) {
      setStatsData(statsResult.data);
    } else {
      setError(statsResult.message);
      setStatsData({
        total_businesses: 0,
        pending_businesses: 0,
        due_payments: 0,
        profit: 0
      });
    }
    
    // Fetch cameras for map
    const camerasResult = await cameraService.getAll();
    if (camerasResult.success) {
      setCameras(camerasResult.data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    async function loadLeaflet() {
      try {
        const rl = await import("react-leaflet");
        const L = await import("leaflet");
        if (!mounted) return;
        setMapComponents({ ...rl, L });
        setMapLoaded(true);
      } catch (err) {
        console.warn("react-leaflet not available — showing placeholder map");
      }
    }

    loadLeaflet();
    return () => {
      mounted = false;
    };
  }, []);

  // Calculate map center based on cameras or use default
  const getMapCenter = () => {
    if (cameras && cameras.length > 0) {
      const firstCamera = cameras[0];
      if (firstCamera.latitude && firstCamera.longitude) {
        return [parseFloat(firstCamera.latitude), parseFloat(firstCamera.longitude)];
      }
    }
    return [51.505, -0.09]; // Default center (London)
  };

  const center = getMapCenter();
  const zoom = cameras && cameras.length > 0 ? 10 : 13;
  const stats = getStatsConfig(statsData);

  return (
    <Box>
      {/* Top row — Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="700" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
          Welcome Super
        </Typography>
      </Box>

      {/* Error Alert */}
      {/* {error && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error} - Showing default values
        </Alert>
      )} */}

      {/* 🔥 Responsive & Clickable Stat Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, mb: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }} sx={{ mb: 3 }}>
          {stats.map((s) => (
            <Grid
              item
              key={s.id}
              xs={12}
              sm={6}
              md={3}
              display="flex"
            >
              <StatCard stat={s} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Map Area */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid rgba(14,30,37,0.06)",
          p: { xs: 1.5, sm: 2 },
          minHeight: { xs: 300, sm: 420 },
          backgroundColor: "rgba(255,255,255,0.98)",
          overflow: "hidden",
        }}
      >
        {mapComponents ? (
          <MapPlaceholderWithLeaflet
            mapComponents={mapComponents}
            center={center}
            zoom={zoom}
            cameras={cameras}
          />
        ) : (
          <Box
            sx={{
              height: 404,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `url(/assets/map-placeholder.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 1,
            }}
          />
        )}
      </Paper>
    </Box>
  );
}

function MapPlaceholderWithLeaflet({ mapComponents, center, zoom, cameras }) {
  const { MapContainer, TileLayer, Marker, Popup, useMap } = mapComponents;

  // Fix Leaflet default marker icons immediately (synchronously)
  React.useEffect(() => {
    const L = mapComponents.L;
    if (L && L.Icon && L.Icon.Default) {
      // Fix default icon paths
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    }
  }, [mapComponents]);

  // Component to handle flying to bounds when cameras load
  function FlyToBounds({ cameras }) {
    const map = useMap();

    React.useEffect(() => {
      if (cameras && cameras.length > 0) {
        const validCameras = cameras.filter(
          (camera) => camera.latitude && camera.longitude
        );

        if (validCameras.length === 0) return;

        // If only one camera, fly to it
        if (validCameras.length === 1) {
          const camera = validCameras[0];
          map.flyTo(
            [parseFloat(camera.latitude), parseFloat(camera.longitude)],
            13,
            { duration: 1.5 }
          );
        } else {
          // Multiple cameras - fit bounds to show all
          const bounds = validCameras.map((camera) => [
            parseFloat(camera.latitude),
            parseFloat(camera.longitude),
          ]);
          map.flyToBounds(bounds, {
            padding: [50, 50],
            duration: 1.5,
            maxZoom: 15,
          });
        }
      }
    }, [cameras, map]);

    return null;
  }

  return (
    <Box sx={{ height: 404, width: "100%" }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FlyToBounds cameras={cameras} />
        
        {/* Display camera markers */}
        {cameras && cameras.length > 0 ? (
          cameras.map((camera) => {
            // Only show cameras with valid coordinates
            if (camera.latitude && camera.longitude) {
              const position = [parseFloat(camera.latitude), parseFloat(camera.longitude)];
              return (
                <Marker 
                  key={camera.id} 
                  position={position}
                >
                  <Popup>
                    <div style={{ minWidth: '200px' }}>
                      <strong style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                        {camera.name || `Camera ${camera.id}`}
                      </strong>
                      {camera.location && (
                        <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                          📍 Location: {camera.location}
                        </div>
                      )}
                      {camera.business_name && (
                        <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                          🏢 Business: {camera.business_name}
                        </div>
                      )}
                      {camera.status && (
                        <div style={{ fontSize: '12px' }}>
                          🔴 Status: <span style={{ 
                            color: camera.status === 'active' ? '#10B981' : '#EF4444',
                            fontWeight: '600'
                          }}>
                            {camera.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })
        ) : (
          // Fallback demo marker if no cameras
          <Marker position={center}>
            <Popup>No cameras available</Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
}