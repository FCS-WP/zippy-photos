import { Box, Button, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useMainProvider } from "../../providers/MainProvider";
import { AlertStatus, showAlert } from "../../helpers/showAlert";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const ImageDownloader = () => {
  const { selectedImages } = useMainProvider();

  const handleDownloadImages = async () => {
    if (!selectedImages || selectedImages.length <= 0) {
      showAlert(
        AlertStatus.warning,
        "Failed",
        "Select images that you want to download!"
      );
      return;
    }
    await downloadPreviewImages(selectedImages);
  };

  const downloadPreviewImages = async (images) => {
    await images.map((img, index) => {
      const link = document.createElement("a");
      link.href = img.preview;
      link.setAttribute("download", img.file.name || `image-${index + 1}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <Box>
      <Tooltip title="Download selected photos" placement="right">
        <IconButton
          className="custom-iconbtn"
          onClick={handleDownloadImages}
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
          }}
        >
          <FileDownloadIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ImageDownloader;
