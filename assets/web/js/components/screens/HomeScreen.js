import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import "react-advanced-cropper/dist/style.css";
import Tools from "../layouts/Tools";
import MediaGallery from "../layouts/MediaGallery";
import ControlBox from "../layouts/ControlBox";
import theme from "../../../theme/customTheme";
import BulkSidebar from "../layouts/BulkSidebar";
import { useMainProvider } from "../../providers/MainProvider";

const HomeScreen = () => {
  const [dragOver, setDragOver] = useState(false);
  const {
    uploadedImages,
    setUploadedImages,
    photoSizes,
    selectedImages,
    removeImages,
  } = useMainProvider();

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const MAX_FILE_SIZE_MB = 20;

    const files = Array.from(e.dataTransfer.files);
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
    <Box
      border={1}
      borderColor={theme.palette.primary.main}
      px={3}
      borderRadius={1}
      minHeight={"400px"}
    >
      <Tools />
      <Grid container spacing={3} mb={{ md: 3 }}>
        <Grid
          size={{ xs: 12, md: 8, lg: 9 }}
          sx={{
            p: 3,
            position: "relative",
            border: dragOver ? "2px dashed #1976d2" : "0",
            overflow: "hidden",
            backgroundColor: dragOver ? "#e3f2fd" : "#fff",
            transition: "0.3s",
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Box>
            {uploadedImages.length > 0 ? (
              <MediaGallery />
            ) : (
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                height={"100%"}
                sx={{
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography variant="h6" width={"100%"} textAlign={"center"}>
                    Upload or your photo to continue
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, md: 4, lg: 3 }}
          borderLeft={{ xs: 0, md: "1px solid lightgray" }}
          px={3}
        >
          <Box position={"sticky"}>
            <BulkSidebar></BulkSidebar>
            <ControlBox />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeScreen;
