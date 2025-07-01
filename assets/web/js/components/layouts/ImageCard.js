import { Box, height } from "@mui/system";
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
  Divider,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Stack,
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
import SizeSelect from "./SizeSelect";

const ImageCard = ({ image }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    removeImages,
    selectImage,
    unSelectImage,
    updateDataImage,
    photoSizes,
  } = useMainProvider();
  const [size, setSize] = useState(image?.size);
  const [paperType, setPaperType] = useState(image?.paper);
  const [quantity, setQuantity] = useState(image?.quantity);
  const [isChecked, setIsChecked] = useState(false);
  const [orientation, setOrientation] = useState("portrait");

  const handleOpenCropper = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const firstLoadOrientation = async () => {
    const imageInfo = await getImageInfo(image.file);
    if (imageInfo) {
      const newOrientation =
        imageInfo.width > imageInfo.height ? "landscape" : "portrait";
      setOrientation(newOrientation);
    }
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

  const refreshData = async () => {
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

  const getImageInfo = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) {
        reject("Not an image file");
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = function () {
        const info = {
          name: file.name,
          sizeBytes: file.size,
          sizeKb: (file.size / 1024).toFixed(2),
          width: img.naturalWidth,
          height: img.naturalHeight,
          lastModified: file.lastModified,
          lastModifiedDate: file.lastModifiedDate,
        };
        URL.revokeObjectURL(url);
        resolve(info);
      };

      img.onerror = reject;
      img.src = url;
    });
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

  useEffect(() => {
    firstLoadOrientation();
    return () => {};
  }, []);

  return (
    <Card sx={{ width: { xs: "100%" }, p: 3, pt: 0 }}>
      <CardActions width={"100%"}>
        <Stack sx={{ width: "100%" }}>
          <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
            <Checkbox
              sx={{ minHeight: 0 }}
              onChange={handleChangeCheckbox}
              icon={<RadioButtonUncheckedIcon color="primary" />}
              checkedIcon={<CheckCircleOutlineIcon color="primary" />}
            />
            <IconButton
              className="ibtn-custom"
              sx={{ minHeight: 0 }}
              aria-label="delete"
              onClick={handleDelete}
            >
              <ClearIcon color="primary" />
            </IconButton>
          </Box>
          <Divider />
          <Box
            my={1}
            display={"flex"}
            gap={1}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            <IconButton
              sx={{ minHeight: 0 }}
              className={`ibtn-custom ${
                orientation == "portrait" ? "active" : ""
              }`}
              onClick={() => setOrientation("portrait")}
            >
              <CropPortraitIcon color="primary" />
            </IconButton>
            <IconButton
              sx={{ minHeight: 0 }}
              className={`ibtn-custom ${
                orientation == "landscape" ? "active" : ""
              }`}
              onClick={() => setOrientation("landscape")}
            >
              <CropLandscapeIcon color="primary" />
            </IconButton>
            <IconButton
              className="ibtn-custom"
              aria-label="crop"
              sx={{ minHeight: 0 }}
              onClick={handleOpenCropper}
            >
              <CropRotateIcon color="primary" />
            </IconButton>
          </Box>
          <Divider />
        </Stack>
      </CardActions>
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
              onChange={(e) => setPaperType(e.target.value)}
            >
              <MenuItem value={"Matte"}>Matte</MenuItem>
              <MenuItem value={"Glossy"}>Glossy</MenuItem>
            </Select>
          </FormControl>
          <SizeSelect onChange={handleChangeSize} image={image} />
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
