import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { useMainProvider } from "../../providers/MainProvider";
import { AlertStatus, showAlert } from "../../helpers/showAlert";
import { webApi } from "../../api";

const Tools = () => {
  const { uploadedImages, setUploadedImages, croppedFiles } = useMainProvider();
  const [isLoading, setIsLoading] = useState(false);

  const updateIdForImage = (newArr = []) => {
    if (newArr.length <= 0) {
      return;
    }
    const updatedData = uploadedImages.map((image, index) => {
      const getNewId = newArr.find((item) => item.temp_id === index);
      if (!getNewId) {
        return image;
      }
      const newData = {
        ...image,
        id: getNewId.photo_id,
        detail_id: getNewId.detail_id,
      };
      return newData;
    });

    setUploadedImages(updatedData);
  };

  const getCroppedFile = (previewUrl) => {
    const croppedItem = croppedFiles.find(
      (item) => item.preview === previewUrl
    );
    return croppedItem ? croppedItem.file : null;
  };

  const handleSaveImages = async () => {
    if (uploadedImages.length <= 0) {
      showAlert(AlertStatus.warning, "Failed", "Images not found!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    uploadedImages.forEach((item, index) => {
      formData.append(`files[${index}][file]`, getCroppedFile(item.preview));
      formData.append(`files[${index}][photo_id]`, item.id ?? null);
      formData.append(`files[${index}][detail_id]`, item.detail_id ?? null);
      formData.append(`files[${index}][quantity]`, item.quantity);
      formData.append(`files[${index}][paper]`, item.paper);
      formData.append(`files[${index}][temp_id]`, index);
      formData.append(`files[${index}][product_id]`, item.size.id);
    });

    const response = await webApi.savePhotos(formData);
    updateIdForImage(response.data);
    if (!response || response.data.error) {
      showAlert(AlertStatus.warning, "Failed", "Failed to save images");
      setIsLoading(false);
      return;
    }

    showAlert(
      AlertStatus.success,
      "Successfully",
      "Your images have been saved!"
    );

    setIsLoading(false);
    return;
  };

  return (
    <Box display={"flex"} justifyContent={"flex-end"} p={2}>
      <Button
        loading={isLoading}
        variant="contained"
        sx={{ color: "#fff" }}
        onClick={handleSaveImages}
      >
        Save
      </Button>
    </Box>
  );
};

export default Tools;
