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
import MiniCropper from "../editor/MiniCropper";
import CropLandscapeIcon from "@mui/icons-material/CropLandscape";
import CropPortraitIcon from "@mui/icons-material/CropPortrait";

const ImageCard = ({ image }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { removeImages, selectImage, unSelectImage, updateDataImage, photoSizes } =
    useMainProvider();
  const [size, setSize] = useState(image?.size);
  const [paperType, setPaperType] = useState(image?.paper);
  const [quantity, setQuantity] = useState(image?.quantity);
  const [isChecked, setIsChecked] = useState(false);
  const [orientation, setOrientation] = useState('portrait')

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
        paper: paperType,
      };
      updateDataImage(image.preview, newData);
    }
  };

  useEffect(() => {
    if (image) {
      refreshData();
    }
    return () => {};
  }, [size, quantity, paperType]);

  useEffect(() => {
    return () => {};
  }, [image]);

  return (
    <Card sx={{ width: { xs: "100%", md: "330px" }, p: 3 }}>
      <CardActions>
        <Box display={"flex"} gap={1} justifyContent={"end"}>
          <Checkbox
            sx={{ minHeight: 0 }}
            onChange={handleChangeCheckbox}
            icon={<RadioButtonUncheckedIcon color="primary" />}
            checkedIcon={<CheckCircleOutlineIcon color="primary" />}
          />
          <IconButton
             sx={{ minHeight: 0 }}
            className={`ibtn-custom ${orientation == 'portrait' ? 'active' : ''}`}
            onClick={() => setOrientation("portrait")}
          >
            <CropPortraitIcon color="primary"/>
          </IconButton>
          <IconButton
            sx={{ minHeight: 0 }}
            className={`ibtn-custom ${orientation == 'landscape' ? 'active' : ''}`}
            onClick={() => setOrientation("landscape")}
          >
            <CropLandscapeIcon color="primary"/>
          </IconButton>
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
      {/* <CardMedia
        component="img"
        sx={{ height: "250px !important", objectFit: "contain" }}
        image={image.preview ?? ""}
        alt={`Uploaded image`}
      /> */}
      <MiniCropper image={image} orientation={orientation} /> 
      <EditPhotoDialog
        isOpen={isOpen}
        image={image}
        onClose={handleCloseDialog}
      />
      <Box mt={3}>
        <Box mb={1} gap={3} alignItems={"center"}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel
              sx={{ background: "#fff", px: 1 }}
              id="label-paper-type"
            >
              Paper Type
            </InputLabel>
            <Select
              labelId="label-paper-type"
              id="paper-type"
              size="small"
              variant="outlined"
              value={paperType}
              sx={{ p: "6px" }}
              onChange={(e)=>setPaperType(e.target.value)}
            >
              <MenuItem value={"Matte"}>Matte</MenuItem>
              <MenuItem value={"Glossy"}>Glossy</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel sx={{ background: "#fff", px: 1 }} id="label-size">
              Size
            </InputLabel>
            <Select
              labelId="label-size"
              id="size"
              size="small"
              variant="outlined"
              value={size}
              sx={{ p: "6px" }}
              onChange={handleChangeSize}
            >
              {photoSizes.map((photoSize) => (
                <MenuItem key={photoSize.id} value={photoSize}>
                  {photoSize.name + " . " + photoSize.price} 
                </MenuItem>
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
