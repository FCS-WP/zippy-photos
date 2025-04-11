import React, { useEffect, useState } from "react";
import { Button, Grid2, Card, CardMedia, Box } from "@mui/material";
import { useMainProvider } from "../../providers/MainProvider";

const ImageUploader = () => {
  const { uploadedImages, setUploadedImages } = useMainProvider();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
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
        onClick={() => document.getElementById("imageUpload").click()}
      >
        Upload
      </Button>
    </Box>
  );
};

export default ImageUploader;
