import React from "react";
import { Button, Box, IconButton, Tooltip } from "@mui/material";
import { useMainProvider } from "../../providers/MainProvider";
import UploadFileIcon from "@mui/icons-material/UploadFile";

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
      <Tooltip title="Upload photos" placement="right">
        <IconButton
          className="custom-iconbtn"
          onClick={() => document.getElementById("imageUpload").click()}
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
          }}
        >
          <UploadFileIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ImageUploader;
