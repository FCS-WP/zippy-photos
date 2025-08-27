import { Box, CircularProgress, Grid } from "@mui/material";
import React from "react";
import PhotoIDDesc from "../layouts/PhotoIDDesc";
import PhotoIDDisplay from "../layouts/PhotoIDDisplay";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";
import PhotoIDControlV2 from "../layouts/PhotoIDControlV2";
import PhotoIDStep from "../layouts/PhotoIDStep";

const PhotoIDScreen = () => {
  const { isApiLoading } = usePhotoIDProvider();
  const renderLoading = () => {
    return (
      <Box my={4} display={"flex"} justifyContent={"center"}>
        <CircularProgress color="primary" />
      </Box>
    );
  };

  return (
    <Grid container spacing={3}>
      {isApiLoading ? (
        <Grid size={12}>{renderLoading()}</Grid>
      ) : (
        <>
          <Grid size={{ xs: 12, md: 8 }}>
            <PhotoIDDisplay />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PhotoIDControlV2 />
          </Grid>

          <Grid size={12}>
            <PhotoIDStep />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default PhotoIDScreen;
