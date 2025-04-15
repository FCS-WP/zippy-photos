import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
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
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import EditPhotoDialog from "./EditPhotoDialog";
import { useMainProvider } from "../../providers/MainProvider";
import { alertConfirmDelete } from "../../helpers/showAlert";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { photoSizes } from "../../helpers/editorHelper";

const ImageCard = ({ image }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { removeImages, selectImage, unSelectImage, updateDataImage } = useMainProvider();
  const [size, setSize] = useState(photoSizes[0]);
  const [quantity, setQuantity] = useState(image?.quantity);
  const [isChecked, setIsChecked] = useState(false);

  const handleOpenCropper = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const handleDelete = async () => {
    const confirm = await alertConfirmDelete();
    if (!confirm) {
      return;
    }
    removeImages([image]);
  };

  const handleChangeCheckbox = (event) => {
    const trigger = event.target.checked
      ? selectImage(image)
      : unSelectImage(image);
    setIsChecked(event.target.checked);
  };

  const handleChangeSize = (e) => {
    setSize(e.target.value);
  };

  const handleChangeQuantity = (value) => {
    if (quantity + parseInt(value) > 0) {
      setQuantity((prev) => parseInt(prev) + parseInt(value));
    }
  };

  const refreshData = () => {
    if (image) {
      const newData = {
        ...image,
        size: size,
        quantity: quantity,
      };
      updateDataImage(image.preview, newData);
    }
  };
  useEffect(() => {
    if (image) {
      refreshData();
    }
    return () => {};
  }, [size, quantity]);

  return (
    <Card sx={{ width: { xs: "100%", md: "330px" }, p: 3 }}>
      <CardActions>
        <Box display={"flex"} gap={1} justifyContent={"end"}>
          <Checkbox
            checked={isChecked}
            sx={{ minHeight: 0 }}
            onChange={handleChangeCheckbox}
            icon={<RadioButtonUncheckedIcon color="primary" />}
            checkedIcon={<CheckCircleOutlineIcon color="primary" />}
          />
          <IconButton
            className="ibtn-custom"
            aria-label="crop"
            sx={{ minHeight: 0 }}
            onClick={handleOpenCropper}
          >
            <CropRotateIcon color="primary" />
          </IconButton>
          <IconButton
            className="ibtn-custom"
            sx={{ minHeight: 0 }}
            aria-label="delete"
            onClick={handleDelete}
          >
            <ClearIcon color="primary" />
          </IconButton>
        </Box>
      </CardActions>
      <CardMedia
        component="img"
        sx={{ height: '250px !important', objectFit: 'contain' }}
        image={image.preview ?? ""}
        alt={`Uploaded image`}
      />
      <EditPhotoDialog
        isOpen={isOpen}
        image={image}
        onClose={handleCloseDialog}
      />
      <Box mt={3}>
        <Box display={"flex"} mb={1} gap={3} alignItems={"center"}>
          <FormControl fullWidth>
            <InputLabel
              sx={{ background: "#fff", px: 1 }}
              id="demo-simple-select-label"
            >
              Size
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              variant="outlined"
              value={size}
              sx={{ p: "6px" }}
              onChange={handleChangeSize}
            >
             
              {photoSizes.map((size, index)=>(
                <MenuItem key={index} value={size}>{size.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box display={"flex"} gap={3} alignItems={"center"}>
          <IconButton
            className="ibtn-custom"
            color="primary"
            size="small"
            sx={{ minHeight: 0 }}
            onClick={() => handleChangeQuantity(-1)}
          >
            <RemoveCircleOutlineIcon color="primary" />
          </IconButton>
          <Input
            className="input-quanity"
            value={quantity}
            onChange={handleChangeQuantity}
            min={1}
          />
          <IconButton
            className="ibtn-custom"
            color="primary"
            size="small"
            sx={{ minHeight: 0 }}
            onClick={() => handleChangeQuantity(1)}
          >
            <ControlPointIcon color="primary" />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default ImageCard;
