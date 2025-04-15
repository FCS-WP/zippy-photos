import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { ImageEditor } from "../editor/ImageEditor";

const EditPhotoDialog = ({ isOpen, image, onClose }) => {
  return (
    <Dialog fullWidth={true} maxWidth={"lg"} open={isOpen} onClose={onClose}>
      <DialogTitle fontSize={20} textAlign={"center"}>
        Edit Your Photo
      </DialogTitle>
      <DialogContent>
        <Box>
          <ImageEditor image={image} onClose={onClose} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditPhotoDialog;
