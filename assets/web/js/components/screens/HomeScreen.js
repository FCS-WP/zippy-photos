import React from "react";
import { Box, Button, Divider, Grid2 } from "@mui/material";
import "react-advanced-cropper/dist/style.css";
import Tools from "../layouts/Tools";
import MediaGallery from "../layouts/MediaGallery";
import ControlBox from "../layouts/ControlBox";
import theme from "../../../theme/customTheme";

const HomeScreen = () => {

  return (
    <Box border={1} borderColor={theme.palette.primary.main} px={3} borderRadius={1}>
      <Tools />
      <Divider />
      <MediaGallery />
      <Divider />
      <ControlBox />
    </Box>
  );
};

export default HomeScreen;
