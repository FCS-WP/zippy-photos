import React, { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { usePhotobookProvider } from "../../providers/PhotobookProvider";
import { setDisabledAddToCart } from "../../helpers/photobookHelper";
import { alertConfirm, showAlert } from "../../helpers/showAlert";

const PhotobookUploader = ({ limitPhotos }) => {
  const { uploadedImages, setUploadedImages, setIsATCDisabled } =
    usePhotobookProvider();
  const [errorMessage, setErrorMessage] = useState("");
  const MAX_FILE_SIZE_MB = 2;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    let inValidImages = [];
    const validFiles = files.filter((file) => {
      const isValid = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
      if (!isValid) {
        inValidImages.push(file.name);
      }
      return isValid;
    });

    if (inValidImages.length > 0) {
      alertConfirm(
        "Warning",
        `Max size is ${MAX_FILE_SIZE_MB}MB.
        Failed files: ${inValidImages.join(", ")}`,
        "Okay",
        false
      );
    }

    const imagePreviews = validFiles.map((file) => ({
      id: null,
      file,
      preview: URL.createObjectURL(file),
    }));
    setUploadedImages([...uploadedImages, ...imagePreviews]);
  };

  useEffect(() => {
    if (!limitPhotos || !uploadedImages) {
      return;
    }
    if (uploadedImages.length < limitPhotos.min) {
      setErrorMessage(`Warning: You need at least ${limitPhotos.min} photos.`);
      setIsATCDisabled(true);
      return;
    }
    if (uploadedImages.length > limitPhotos.max) {
      setErrorMessage("Exceeded the maximum number of photos.");
      setIsATCDisabled(true);
      return;
    }
    setIsATCDisabled(false);
    return setErrorMessage("");
  }, [limitPhotos, uploadedImages]);

  return (
    <Box
      mb={3}
      display={"flex"}
      flexDirection={{ xs: "column", md: "row" }}
      gap={3}
      alignItems={{ xs: "start", md: "center" }}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        id="imageUpload"
        style={{ display: "none" }}
      />
      <Button
        variant="contained"
        color="secondary"
        sx={{ color: "#fff", borderRadius: 0 }}
        onClick={() => document.getElementById("imageUpload").click()}
      >
        Upload Photos
      </Button>
      {limitPhotos && (
        <Box>
          <Typography fontSize={14}>
            Maximum: <strong>{limitPhotos.max} photos</strong>{" "}
          </Typography>
          <Typography fontSize={14}>
            Current:{" "}
            <strong>
              {uploadedImages.length}{" "}
              {uploadedImages.length > 1 ? "photos" : "photo"}
            </strong>
          </Typography>
          {errorMessage && (
            <Typography fontSize={14} color="warning">
              {errorMessage}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PhotobookUploader;
