import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Cropper,
  FixedCropper,
  ImageRestriction,
} from "react-advanced-cropper";
import { useMainProvider } from "../../providers/MainProvider";
import { dataURLToFile, inchToPx } from "../../helpers/editorHelper";
import { debounce } from "../../helpers/debounce";
import { Box, Button, IconButton } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

const MiniCropper = ({ image, orientation }) => {
  const cropperRef = useRef(null);
  const previewRef = useRef(null);
  const wrapperRef = useRef(null);
  const [wrapperView, setWrapperView] = useState(null);
  const { updateDataImage, updateCroppedFiles } = useMainProvider();
  const [src, setSrc] = useState(image.preview);
  const [ratioValue, setRatioValue] = useState(
    image.size.width_in / image.size.height_in
  );

  const defaultSize = {
    width: inchToPx(image.size.width_in),
    height: inchToPx(image.size.height_in),
  };

  const onUpdate = () => {
    previewRef.current?.refresh();
    debounceUpdateCroppedPhoto();
  };

  const debounceUpdateCroppedPhoto = useCallback(
    debounce(() => {
      handleLoadCroppedImage();
    }, 1000),
    []
  );

  const refreshRatio = () => {
    let newRatioValue;
    switch (orientation) {
      case "portrait":
        newRatioValue =
          image.size.width_in < image.size.height_in
            ? image.size.width_in / image.size.height_in
            : image.size.height_in / image.size.width_in;
        break;
      case "landscape":
        newRatioValue =
          image.size.width_in > image.size.height_in
            ? image.size.width_in / image.size.height_in
            : image.size.height_in / image.size.width_in;
        break;
      default:
        break;
    }
    setRatioValue(newRatioValue);

    debounceUpdateCroppedPhoto();
  };

  const handleImageLoad = () => {
    // const cropper = cropperRef.current;
    // const customSize = {
    //   width: defaultSize.width * 3,
    //   height: defaultSize.height * 3,
    // };

    // const stencilWidth =
    //   orientation == "portrait" ? customSize.width : customSize.height;
    // const stencilHeight =
    //   orientation == "portrait" ? customSize.height : customSize.width;

    // cropper.setCoordinates({
    //   width: stencilWidth,
    //   height: stencilHeight,
    //   left: 0,
    //   top: 0,
    // });

    setTimeout(() => {
      handleLoadCroppedImage();
    }, 100);
  };

  const handleLoadCroppedImage = () => {
    const canvas = cropperRef.current.getCanvas({
      width: cropperRef.current.getCoordinates().width,
      height: cropperRef.current.getCoordinates().height,
    });
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const file = dataURLToFile(dataUrl, `cropped-${Date.now()}.png`);

    updateCroppedFiles(image.preview, file);
  };

  const refreshImage = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      cropper.refresh();
    }
  };

  const onZoom = (scale, options) => {
    const cropper = cropperRef.current;
    if (cropper) {
      cropper.zoomImage(scale, options);
    }
  }


  useEffect(() => {
    refreshRatio();
    refreshImage();
  }, [image, orientation]);

  return (
    <div ref={wrapperRef}>
      <Box className="mini-cropper-wrapped">
        <FixedCropper
          src={src}
          ref={cropperRef}
          stencilSize={defaultSize}
          imageRestriction={ImageRestriction.stencil}
          stencilProps={{
            aspectRatio: ratioValue,
            movable: false,
            grid: true,
            resizable: false,
            lines: true,
            handlers: false,
          }}
          transformImage={{
            scale: 1,
          }}
          className="photo-id-cropper"
          onUpdate={onUpdate}
          onReady={handleImageLoad}
        />
      </Box>
      <Box display={'flex'} pt={2} justifyContent={'space-between'}>
          <IconButton
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `50%`,
            fontSize: 14,
          }}
       
          onClick={() => onZoom(1.1)}
          color="primary"
        >
          <ZoomInIcon />
        </IconButton>

        <IconButton
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `50%`,
            fontSize: 14,
          }}
          onClick={() => onZoom(0.9)}
          color="primary"
        >
          <ZoomOutIcon />
        </IconButton>
      </Box>
    </div>
  );
};

export default MiniCropper;
