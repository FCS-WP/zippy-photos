import { Button, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useMainProvider } from "../../providers/MainProvider";
import { toast } from "react-toastify";
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
const API_KEY = "";

const GoogleDrivePicker = () => {
  const { uploadedImages, setUploadedImages, photoSizes } = useMainProvider();
  const [pickerReady, setPickerReady] = useState(false);
  const accessTokenRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Load Google Picker API
  useEffect(() => {
    const apiScript = document.createElement("script");
    apiScript.src = "https://apis.google.com/js/api.js";
    apiScript.onload = () => {
      window.gapi.load("picker", () => {
        setPickerReady(true);
      });
    };
    document.body.appendChild(apiScript);
  }, []);

  const openCenteredPopup = (url, title, w = 500, h = 600) => {
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY;
    const width =
      window.innerWidth || document.documentElement.clientWidth || screen.width;
    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;

    const newWindow = window.open(
      url,
      title,
      `
        scrollbars=yes,
        width=${w}, 
        height=${h}, 
        top=${top}, 
        left=${left}
      `
    );

    if (window.focus) newWindow.focus();
    return newWindow;
  };
  // Open popup to start OAuth flow
  const openOAuthPopup = () => {
    const popup = openCenteredPopup(
      "/wp-json/zippy-addons/v1/get-google-token",
      "GoogleDriveLogin"
    );

    let tokenReceived = false;
    const interval = setInterval(() => {
      try {
        const params = new URLSearchParams(popup?.location?.search || "");
        const tokenParam = params.get("token");

        if (tokenParam) {
          const token = JSON.parse(decodeURIComponent(tokenParam));
          accessTokenRef.current = token.access_token;
          popup.close();
          clearInterval(interval);
          openPicker();
        }
        if (!tokenParam && popup?.location?.search.includes("error")) {
          popup.close();
          clearInterval(interval);
        }

        if (popup.closed) {
          clearInterval(interval);
        }
      } catch (e) {
        // Cross-origin error will happen until redirect to same-origin page
      }
    }, 300);
  };

  const openPicker = () => {
    if (!accessTokenRef.current || !window.google?.picker) {
      toast.error("Google Picker not ready or token missing.");
      return;
    }

    const view = new window.google.picker.DocsView(
      window.google.picker.ViewId.DOCS_IMAGES
    )
      .setIncludeFolders(false)
      .setSelectFolderEnabled(false);

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
      .setOAuthToken(accessTokenRef.current)
      .setDeveloperKey(API_KEY)
      .setCallback(pickerCallback)
      .build();

    picker.setVisible(true);
  };

  const pickerCallback = (data) => {
    if (data.action === window.google.picker.Action.PICKED) {
      setSelectedFiles(data.docs);
    }
  };

  useEffect(() => {
    if (selectedFiles.length > 0) {
      downloadAndHandleFiles(selectedFiles);
    }
  }, [selectedFiles]);

  const downloadAndHandleFiles = async (files) => {
    try {
      const downloadPromises = files.map(async (file) => {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${accessTokenRef.current}`,
            },
          }
        );
        const blob = await response.blob();

        return new File([blob], file.name || "google-drive-image.jpg", {
          type: blob.type,
        });
      });

      const downloadedFiles = await Promise.all(downloadPromises);
      handlePreviewImages(downloadedFiles);
    } catch (error) {
      toast.error("Failed to download Google Drive image(s).");
    }
  };

  const handlePreviewImages = (files) => {
    const imagePreviews = files.map((file) => ({
      id: null,
      file,
      preview: URL.createObjectURL(file),
      quantity: 1,
      paper: "Matte",
      size: photoSizes[0],
    }));
    setUploadedImages([...uploadedImages, ...imagePreviews]);
  };

  return (
    <div>
      <Tooltip title="Upload photos from Drive" placement="right" >
        <IconButton 
          onClick={openOAuthPopup}
          sx={{ ":hover": {backgroundColor: '#222'}, minHeight: 'auto !important', color: '#222'}}
          className="custom-iconbtn" 
        >
          <AddToDriveIcon color="black"/>
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default GoogleDrivePicker;
