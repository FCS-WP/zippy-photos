import { Box } from "@mui/material";
import React from "react";
import ImageUploader from "./ImageUploader";
import ImageRemover from "./ImageRemover";
import ImageDownloader from "./ImageDownloader";
import GoogleDrivePicker from "./GoogleDrivePicker";

const ControlBox = () => {
  return (
    <Box
      display={"flex"}
      gap={2}
      alignItems={"center"}
      justifyContent={"center"}
      my={3}
      flexWrap={"wrap"}
    > 
      <GoogleDrivePicker />
      <ImageUploader />
      <ImageDownloader />
      <ImageRemover />
    </Box>
  );
};

export default ControlBox;
