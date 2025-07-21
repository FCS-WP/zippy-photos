import React from "react";
import { useMainProvider } from "../../providers/MainProvider";
import { Box, Grid } from "@mui/material";
import ImageCard from "./ImageCard";

const MediaGallery = () => {
  const { uploadedImages } = useMainProvider();

  return (
    <Grid container spacing={3}>
      {uploadedImages.length > 0 &&
        uploadedImages.map((item) => (
          <Grid key={item.preview} size={{ xs: 12, sm: 6, lg: 4 }}>
            <ImageCard image={item} />
          </Grid>
        ))}
    </Grid>
  );
};

export default MediaGallery;
