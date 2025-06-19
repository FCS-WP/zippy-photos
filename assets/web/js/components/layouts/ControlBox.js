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
      justifyContent={"center"}
      my={3}
      flexWrap={"wrap"}
    > 
      <GoogleDrivePicker />
      <ImageUploader />
      <ImageRemover />
      <ImageDownloader />
    </Box>
  );
};

export default ControlBox;
