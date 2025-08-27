import React from "react";
import { Box, Button, Divider, Grid } from "@mui/material";
import "react-advanced-cropper/dist/style.css";
import Tools from "../layouts/Tools";
import MediaGallery from "../layouts/MediaGallery";
import ControlBox from "../layouts/ControlBox";
import theme from "../../../theme/customTheme";
import BulkSidebar from "../layouts/BulkSidebar";

const HomeScreen = () => {

  return (
    <Box border={1} borderColor={theme.palette.primary.main} px={3} borderRadius={1} minHeight={'400px'}>
      <Tools />
      <Grid container spacing={3} mb={{ md: 3 }}>
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Box>
            <MediaGallery />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4, lg: 3 }} borderLeft={{ xs: 0, md: '1px solid lightgray' }} px={3} >
          <Box position={'sticky'}>
            <BulkSidebar></BulkSidebar>
            <ControlBox/>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeScreen;
