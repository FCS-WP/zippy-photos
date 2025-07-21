import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme/theme";
import { BrowserRouter } from "react-router";
import AdminMenus from "./Pages/Menus/AdminMenus";
import Dashboard from "./Pages/Dashboard";

function initializeApp() {
  const zippyBookings = document.getElementById("zippy_photo_dashboard");

  if (zippyBookings) {
    const root = ReactDOM.createRoot(zippyBookings);
    root.render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dashboard />
      </ThemeProvider>
    );
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);

const zippyMenus = document.getElementById("zippy_menus");

if (zippyMenus) {
  const root = ReactDOM.createRoot(zippyMenus);
  root.render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <AdminMenus />
      </BrowserRouter>
    </ThemeProvider>
  );
}
