import { Box, Typography } from "@mui/material";
import React from "react";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";

const PhotoIDDesc = () => {
  const { productData } = usePhotoIDProvider();
  return (
    <Box>
      <Typography fontSize={14}>
        { !!productData.description && (
          productData.description
        ) }
      </Typography>
    </Box>
  );
};

export default PhotoIDDesc;
