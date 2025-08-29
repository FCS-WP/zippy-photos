import { Box, CircularProgress, Grid } from "@mui/material";
import React from "react";
import PhotoIDDesc from "../layouts/PhotoIDDesc";
import PhotoIDDisplay from "../layouts/PhotoIDDisplay";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";
import PhotoIDControlV2 from "../layouts/PhotoIDControlV2";
import PhotoIDStep from "../layouts/PhotoIDStep";
import { StyledPaper } from "../mui-custom";

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
    <StyledPaper >
      <Grid container spacing={4}>
        {isApiLoading ? (
          <Grid size={12}>{renderLoading()}</Grid>
        ) : (
          <>
            <Grid size={{ xs: 12, md: 8 }} height={'100%'}>
              <PhotoIDDisplay />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} height={'100%'}>
              <PhotoIDControlV2 />
            </Grid>

            <Grid size={12}>
              <PhotoIDStep />
            </Grid>
          </>
        )}
      </Grid>
    </StyledPaper>
  );
};

export default PhotoIDScreen;
