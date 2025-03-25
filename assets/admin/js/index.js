import React from "react";
import ReactDOM from "react-dom/client";
import Index from "./Pages/Bookings";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme/theme";

function initializeApp() {
  const zippyBookings = document.getElementById("root_app");

  if (zippyBookings) {
    const root = ReactDOM.createRoot(zippyBookings);
    root.render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <>Shin</>
      </ThemeProvider>
    );
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);
