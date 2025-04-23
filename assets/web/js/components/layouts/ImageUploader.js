import React from "react";
import { Button, Box } from "@mui/material";
import { useMainProvider } from "../../providers/MainProvider";
import theme from "../../../theme/customTheme";

const ImageUploader = () => {
  const { uploadedImages, setUploadedImages, photoSizes } = useMainProvider();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => ({
      id: null,
      file,
      preview: URL.createObjectURL(file),
      quantity: 1,
      paper: 'Matte',
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
        sx={{ color: "#fff" }}
        onClick={() => document.getElementById("imageUpload").click()}
      >
        Upload
      </Button>
    </Box>
  );
};

export default ImageUploader;
