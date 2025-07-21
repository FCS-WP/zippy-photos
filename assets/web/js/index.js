import React from "react";
import ReactDOM from "react-dom/client";
import theme from "../theme/customTheme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import PhotoEditor from "./pages/PhotoEditor";
import PhotobookSingle from "./pages/PhotobookSingle";
import "./helpers/photobookHelper";
import "./helpers/add_to_cart_variable";

document.addEventListener("DOMContentLoaded", function () {
  const zippyMain = document.getElementById("zippy_photo_editor");
  if (typeof zippyMain != "undefined" && zippyMain != null) {
    const root = ReactDOM.createRoot(zippyMain);
    root.render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PhotoEditor />
        <ToastContainer />
      </ThemeProvider>
    );
  }
});

$(function () {
  function renderPhotobook(variation_id) {
    const productIdInput = $('input[name="product_id"]');
    const productType = $("#zippy_photobook").data("product_type");
    let mainProductId =
      productIdInput.length !== 0
        ? productIdInput.val()
        : $(".single_add_to_cart_button").data("product_id");
    if (zippyPhotobook) {
      if (!root) {
        root = ReactDOM.createRoot(zippyPhotobook); // Only create root once
      }
      if (variation_id) {
        root.render(
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <PhotobookSingle
              variationId={variation_id}
              productId={mainProductId}
              productType={productType}
            />
            <ToastContainer />
          </ThemeProvider>
        );
      } else {
        root.render(<></>);
      }
    }
  }

  // Observe changes to attributes on the target element
  const target = document.querySelector('input[name="variation_id"]');
  const zippyPhotobook = document.getElementById("zippy_photobook");
  let root = null;
  let lastVariationId = null;

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "value"
      ) {
        const newVariationId = target.getAttribute("value");

        if (!newVariationId) {
          lastVariationId = null;
          renderPhotobook(null);
        } else if (newVariationId !== lastVariationId) {
          lastVariationId = newVariationId;
          renderPhotobook(newVariationId);
        }
      }
    }
  });

  if (target) {
    observer.observe(target, { attributes: true });
  }
  renderPhotobook();
});
