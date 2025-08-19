import { Box, CircularProgress, Grid } from "@mui/material";
import React from "react";
import PhotoIDDesc from "../layouts/PhotoIDDesc";
import PhotoIDControl from "../layouts/PhotoIDControl";
import PhotoIDDisplay from "../layouts/PhotoIDDisplay";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";

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
          <Grid size={{ xs: 12, md: 4 }}>
            <PhotoIDDisplay />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PhotoIDDesc />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PhotoIDControl />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default PhotoIDScreen;
