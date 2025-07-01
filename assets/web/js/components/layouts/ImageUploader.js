import React from "react";
import { Button, Box } from "@mui/material";
import { useMainProvider } from "../../providers/MainProvider";

const ImageUploader = () => {
  const { uploadedImages, setUploadedImages, photoSizes } = useMainProvider();
  const MAX_FILE_SIZE_MB = 5;

  const handleImageChange = (e) => {
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

  return (
    <Box>
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
        sx={{ color: "#fff", width: "200px" }}
        onClick={() => document.getElementById("imageUpload").click()}
      >
        Upload from device
      </Button>
    </Box>
  );
};

export default ImageUploader;
