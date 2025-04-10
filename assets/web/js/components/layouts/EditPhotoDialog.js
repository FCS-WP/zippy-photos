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
import { Cropper, CropperPreview } from "react-advanced-cropper";

const EditPhotoDialog = ({ isOpen, image, onClose }) => {
  const previewRef = useRef(null);
  const cropperRef = useRef(null);

  const onUpdate = (cropper) => {
    previewRef.current?.update(cropper);
  };

  return (
    <Dialog fullWidth={true} maxWidth={"lg"} open={isOpen} onClose={onClose}>
      <DialogTitle fontSize={20} textAlign={"center"}>
        Edit Photos
      </DialogTitle>
      <DialogContent>
        <Box>
          <Grid2 container spacing={3} justifyContent={'center'}>
            <Grid2 size={4}>
              <Cropper src={image.preview} onUpdate={onUpdate} className={"cropper"} />
            </Grid2>
            <Grid2 size={4}>
              <CropperPreview ref={previewRef} className="preview" />
            </Grid2>
          </Grid2>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPhotoDialog;
