import { Box } from "@mui/material";
import React from "react";
import GoogleDrivePicker from "./GoogleDrivePicker";
import ImageUploader from "./ImageUploader";
import ImageDownloader from "./ImageDownloader";
import ImageRemover from "./ImageRemover";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";

const ControlBoxPhotoID = () => {
  const MAX_FILE_SIZE_MB = 20;
  const { updateState } = usePhotoIDProvider();
  const handleUploadImages = (e) => {
    const file = e.target.files[0];
    const isValid = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

    if (!isValid) {
      alert(`"${file.name}" is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }

    const imagePreviews = {
      file: file,
      preview: URL.createObjectURL(file),
    };

    updateState({ uploadedImage: imagePreviews });
    return true;
  };

  const handlePreviewImages = (files) => {
    const imagePreviews = {
      file: files[0],
      preview: URL.createObjectURL(files[0]),
    };
    updateState({ uploadedImage: imagePreviews });
    return true;
  };

  return (
    <Box
      display={"flex"}
      gap={2}
      alignItems={"center"}
      justifyContent={"space-around"}
      flexWrap={"wrap"}
    >
      <GoogleDrivePicker handlePreviewImages={handlePreviewImages} />
      <ImageUploader onChangeImages={handleUploadImages} />
    </Box>
  );
};

export default ControlBoxPhotoID;
