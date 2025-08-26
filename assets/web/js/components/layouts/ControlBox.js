import { Box } from "@mui/material";
import React from "react";
import ImageUploader from "./ImageUploader";
import ImageRemover from "./ImageRemover";
import ImageDownloader from "./ImageDownloader";
import GoogleDrivePicker from "./GoogleDrivePicker";
import { useMainProvider } from "../../providers/MainProvider";
import {
  alertConfirmDelete,
  AlertStatus,
  showAlert,
} from "../../helpers/showAlert";

const ControlBox = () => {
  const MAX_FILE_SIZE_MB = 20;
  // Provider of Photo Editor
  const {
    uploadedImages,
    setUploadedImages,
    photoSizes,
    selectedImages,
    removeImages,
  } = useMainProvider();
  // Provider of Photo ID

  // Start handle Photo Editor
  const handleImageChangeEditor = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const isValid = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
      if (!isValid) {
        alert(
          `"${file.name}" is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`
        );
      }
      return isValid;
    });

    const imagePreviews = validFiles.map((file) => ({
      id: null,
      file,
      preview: URL.createObjectURL(file),
      quantity: 1,
      paper: "Matte",
      size: photoSizes[0],
    }));
    setUploadedImages([...uploadedImages, ...imagePreviews]);
  };

  const handleEditorPreviewImages = (files) => {
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

  // End handle Photo Editor

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

  const handleRemoveAllSelected = async () => {
    if (selectedImages.length <= 0) {
      showAlert(
        AlertStatus.warning,
        "Failed",
        "Select images that you want to remove!"
      );
      return;
    }
    const confirm = await alertConfirmDelete();
    if (!confirm) {
      return;
    }
    removeImages(selectedImages);
    showAlert(AlertStatus.success, "Successfully", "");
  };

  return (
    <Box
      display={"flex"}
      gap={2}
      alignItems={"center"}
      justifyContent={"center"}
      my={3}
      flexWrap={"wrap"}
    >
      <GoogleDrivePicker handlePreviewImages={handleEditorPreviewImages} />
      <ImageUploader onChangeImages={handleImageChangeEditor} />
      <ImageDownloader onClickDownload={handleDownloadImages} />
      <ImageRemover onClickRemoveImages={handleRemoveAllSelected} />
    </Box>
  );
};

export default ControlBox;
