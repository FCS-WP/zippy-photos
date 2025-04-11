import { Box } from "@mui/system";
import React, { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CropRotateIcon from "@mui/icons-material/CropRotate";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  IconButton,
} from "@mui/material";
import EditPhotoDialog from "./EditPhotoDialog";
import { useMainProvider } from "../../providers/MainProvider";

const ImageCard = ({ image }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { removeImages, selectImage, unSelectImage } = useMainProvider();

  const handleOpenCropper = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const handleDelete = () => {
    removeImages([image]);
  };

  const handleChangeCheckbox = (event) => {
    const trigger = event.target.checked
      ? selectImage(image)
      : unSelectImage(image);
  };

  return (
    <Card
      sx={{
        width: {
          xs: "100%",
          md: 300,
        },
        p: 3,
      }}
    >
      <CardActions>
        <Box display={"flex"} gap={1} justifyContent={"end"}>
          <Checkbox
            onChange={handleChangeCheckbox}
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<CheckCircleOutlineIcon />}
          />
          <IconButton
            aria-label="crop"
            sx={{ padding: 1, borderRadius: 1 }}
            onClick={handleOpenCropper}
          >
            <CropRotateIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={handleDelete}>
            <ClearIcon />
          </IconButton>
        </Box>
      </CardActions>
      <CardMedia
        component="img"
        sx={{ height: 200 }}
        image={image.preview ?? ""}
        alt={`Uploaded image`}
      />
      <EditPhotoDialog
        isOpen={isOpen}
        image={image}
        onClose={handleCloseDialog}
      />
    </Card>
  );
};

export default ImageCard;
