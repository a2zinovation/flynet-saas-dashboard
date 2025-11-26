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

/**
 * Dashboard with responsive Stat Cards
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
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        border: "1px solid rgba(14, 30, 37, 0.06)",
        minHeight: { xs: 80, sm: 96 },
        width: "100%",
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

  const center = [51.505, -0.09];
  const zoom = 13;

  return (
    <Box>
      {/* Top row — Title */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="700">
          Welcome Super
        </Typography>
      </Box>

      {/* 🔥 Responsive Stat Cards */}
      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }}
        sx={{ mb: 3 }}
      >
        {stats.map((s) => (
          <Grid
            item
            key={s.id}
            xs={12}     // 1 per row (mobile)
            sm={6}      // 2 per row (tablet)
            md={3}      // 4 per row (desktop)
            lg={3}      // 4 per row (large desktop)
            display="flex"
          >
            <StatCard stat={s} />
          </Grid>
        ))}
      </Grid>

      {/* Map area */}
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
        {mapComponents ? (
          <MapPlaceholderWithLeaflet
            mapComponents={mapComponents}
            center={center}
            zoom={zoom}
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

/**
 * MapPlaceholderWithLeaflet
 */
function MapPlaceholderWithLeaflet({ mapComponents, center, zoom }) {
  const { MapContainer, TileLayer, Marker, Popup } = mapComponents;

  return (
    <Box sx={{ height: 404, width: "100%" }}>
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
