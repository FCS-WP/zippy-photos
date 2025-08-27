import React, { useRef, useState } from "react";
import { StyledPaper } from "../mui-custom";
import { Box, Button, Typography } from "@mui/material";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";
import PhotoIDCropper from "./PhotoIDCropper";

const PhotoIDDisplay = () => {
  const { uploadedImage } = usePhotoIDProvider();
  return (
    <StyledPaper>
      <Box>
        <PhotoIDCropper image={uploadedImage} />
      </Box>
    </StyledPaper>
  );
};

export default PhotoIDDisplay;
