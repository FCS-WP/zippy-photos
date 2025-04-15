import React from "react";
import { Button, Box } from "@mui/material";
import { useMainProvider } from "../../providers/MainProvider";

const ImageUploader = () => {
  const { uploadedImages, setUploadedImages } = useMainProvider();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      quantity: 1,
      size: { id: 1, name: `2.17" x 2.95" (2R)`, price: 1.5 },
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
        sx={{ color: "#fff" }}
        onClick={() => document.getElementById("imageUpload").click()}
      >
        Upload
      </Button>
    </Box>
  );
};

export default ImageUploader;
