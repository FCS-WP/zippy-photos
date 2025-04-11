import { Box, Button } from "@mui/material";
import React from "react";
import { useMainProvider } from "../../providers/MainProvider";
import { AlertStatus, showAlert } from "../../helpers/showAlert";

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
  }

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
      <Button onClick={handleDownloadImages}>Download</Button>
    </Box>
  );
};

export default ImageDownloader;
