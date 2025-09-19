import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";
import PhotoIDCropper from "./PhotoIDCropper";
import PhotoIDDesc from "./PhotoIDDesc";

const PhotoIDDisplay = () => {
  const { uploadedImage } = usePhotoIDProvider();
  return (
    <>
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", md: "row" }}
        gap={{ xs: 2, md: 4 }}
      >
        <PhotoIDCropper image={uploadedImage} />
        <PhotoIDDesc />
      </Box>
    </>
  );
};

export default PhotoIDDisplay;
