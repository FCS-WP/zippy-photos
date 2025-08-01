import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ImageEditor } from "../editor/ImageEditor";
import SizeSelect from "./SizeSelect";
import { useMainProvider } from "../../providers/MainProvider";

const EditPhotoDialog = ({ isOpen, image, onClose }) => {
  const [size, setSize] = useState(image.size);
  const { updateDataImage } = useMainProvider();
  const handleChangeSize = (event) => {
    setSize(event.target.value);
  };

  const refreshData = () => {
    if (image) {
      const newData = {
        ...image,
        size: size,
      };
      updateDataImage(image.preview, newData);
    }
  };

  useEffect(() => {
    if (image) {
      refreshData();
    }
    return () => {};
  }, [size]);

  return (
    <Dialog fullWidth={true} maxWidth={"lg"} open={isOpen} onClose={onClose}>
      <Box m={2} display={"flex"} justifyContent={"flex-end"}>
        <Box width={300}>
          <SizeSelect onChange={handleChangeSize} image={image} />
        </Box>
      </Box>
      <DialogContent sx={{ p: 0 }}>
        <Box>
          <ImageEditor image={image} onClose={onClose} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditPhotoDialog;
