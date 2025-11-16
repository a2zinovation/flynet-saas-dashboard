// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  useTheme,
  Stack,
  Avatar,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

/**
 * Dashboard (Figma-focused)
 * - Uses public SVG icons at /assets/icons/*
 * - Tries to dynamically import react-leaflet for a live map (graceful fallback to placeholder)
 *
 * Drop this file into src/pages/Dashboard.jsx
 */

const stats = [
  {
    id: "all-business",
    label: "All Business",
    value: "501",
    icon: "/assets/icons/business.svg",
    valueColor: undefined,
  },
  {
    id: "pending",
    label: "Pending Registration",
    value: "01",
    icon: "/assets/icons/pending.svg",
    valueColor: undefined,
  },
  {
    id: "due",
    label: "Due payments",
    value: "01",
    icon: "/assets/icons/payment.svg",
    valueColor: undefined,
  },
  {
    id: "profit",
    label: "Profit",
    value: "$500",
    icon: "/assets/icons/profit.svg",
    valueColor: "#17A34A",
  },
];

function StatCard({ stat }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid rgba(14, 30, 37, 0.06)",
        minHeight: 96,
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.98)",
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
              color: stat.valueColor ? stat.valueColor : theme.palette.text.primary,
              mt: 0.5,
            }}
          >
            {stat.value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function Dashboard() {
  const theme = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapComponents, setMapComponents] = useState(null);
  const [mapError, setMapError] = useState(false);

  // Try to dynamically import react-leaflet (so dev does not crash if it's not installed)
  useEffect(() => {
    let mounted = true;
    async function loadLeaflet() {
      try {
        // dynamic import - if not installed this will throw and we fall back
        const rl = await import("react-leaflet");
        const L = await import("leaflet");
        if (!mounted) return;
        setMapComponents({ ...rl, L });
        setMapLoaded(true);
      } catch (err) {
        // Not fatal — we will show placeholder image
        console.warn(
          "react-leaflet not available — falling back to placeholder map. Install react-leaflet + leaflet to enable real map."
        );
        setMapError(true);
      }
    }
    loadLeaflet();
    return () => {
      mounted = false;
    };
  }, []);

  // Default map center (if leaflet loaded)
  const center = [51.505, -0.09];
  const zoom = 13;

  return (
    <Box>
      {/* Top row — Title + action */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="700">
          Welcome Super
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            startIcon={<img src="/assets/icons/filter.svg" alt="filter" style={{ width: 18 }} />}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Filter by day
          </Button>
        </Stack>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={10} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.id}>
            <StatCard stat={s} />
          </Grid>
        ))}
      </Grid>

      {/* Map area — card style like Figma */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid rgba(14,30,37,0.06)",
          p: 2,
          minHeight: 420,
          backgroundColor: "rgba(255,255,255,0.98)",
          overflow: "hidden",
        }}
      >
        {/* If react-leaflet loaded, render map; otherwise use placeholder */}
        {mapComponents ? (
          // render map using dynamically imported components
          <MapPlaceholderWithLeaflet
            mapComponents={mapComponents}
            center={center}
            zoom={zoom}
          />
        ) : (
          <Box
            sx={{
              height: 420 - 16,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `url(/assets/map-placeholder.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 1,
            }}
            role="img"
            aria-label="Map placeholder"
          />
        )}
      </Paper>
    </Box>
  );
}

/**
 * MapPlaceholderWithLeaflet
 * Renders a basic Leaflet map using the dynamically loaded react-leaflet module (mapComponents).
 * mapComponents must contain MapContainer, TileLayer, Marker, Popup from react-leaflet.
 */
function MapPlaceholderWithLeaflet({ mapComponents, center, zoom }) {
  // Pull components from the dynamic import
  const { MapContainer, TileLayer, Marker, Popup } = mapComponents;

  // NOTE: We assume leaflet CSS is included globally (see instructions above)
  // Also, Marker icon image path fix may be required on some builds — this is a minimal example.

  return (
    <Box sx={{ height: 420 - 16, width: "100%" }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>Flynet demo marker</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}
