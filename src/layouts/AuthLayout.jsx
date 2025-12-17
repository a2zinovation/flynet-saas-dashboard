import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  // 🔥 Collapse ONLY on small phones, not tablets/laptops
  const isSmall = useMediaQuery("(max-width:500px)");

  return (
    <Box
      sx={{
        display: "flex",

        // Desktop/tablet stay side-by-side, phones collapse
        flexDirection: isSmall ? "column" : "row",

        height: isSmall ? "auto" : "100vh",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Outlet />
    </Box>
  );
}