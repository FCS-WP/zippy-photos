import React from "react";
import ReactDOM from "react-dom/client";
import theme from "../theme/customTheme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import PhotoEditor from "./pages/PhotoEditor";

document.addEventListener("DOMContentLoaded", function () {
  const zippyMain = document.getElementById("zippy_photo_editor");

  if (typeof zippyMain != "undefined" && zippyMain != null) {
    const root = ReactDOM.createRoot(zippyMain);
    root.render(      
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
        <PhotoEditor />
      <ToastContainer />
    </ThemeProvider>);
  }
});
