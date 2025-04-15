import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { useMainProvider } from "../../providers/MainProvider";
import { AlertStatus, showAlert } from "../../helpers/showAlert";
import { webApi } from "../../api";

const Tools = () => {
  const { uploadedImages } = useMainProvider();
  const [isLoading, setIsLoading] = useState(false);
  const handleSaveImages = async () => {
    if (uploadedImages.length <= 0) {
      showAlert(AlertStatus.warning, "Failed", "Images not found!");
      return;
    }
    // handle Api to save
    setIsLoading(true);
    const formData = new FormData();
    uploadedImages.forEach((file) => formData.append("file[]", file.file));
    const response = await webApi.savePhotos(formData);
    if (!response) { 
      showAlert(AlertStatus.warning, "Failed", "Failed to save images");
      setIsLoading(false);
      return;
    }
    showAlert(AlertStatus.success, "Successfully", "");
    setIsLoading(false);
    return
  };
  return (
    <Box display={"flex"} justifyContent={"flex-end"} p={2}>
      <Button loading={isLoading} variant="outlined" onClick={handleSaveImages}>
        Finish
      </Button>
    </Box>
  );
};

export default Tools;
