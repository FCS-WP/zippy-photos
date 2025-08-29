import { Box, Typography } from "@mui/material";
import React from "react";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";

const PhotoIDDesc = () => {
  const { productData } = usePhotoIDProvider();
  return (
    <Box className="photo-id-box" width={'100%'}>
      <Typography fontSize={14}>
        { !!productData.description ? (
          productData.description
        ) : (
          <Box textAlign={'center'}>
          <Typography variant="h5" fontWeight={700} color="secondary">WELCOME TO MACH PHOTO</Typography>
          <Typography variant="h6">Create Your Photo ID</Typography>
          </Box>
        ) }
      </Typography>
    </Box>
  );
};

export default PhotoIDDesc;
