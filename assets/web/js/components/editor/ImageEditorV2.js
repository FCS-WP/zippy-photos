import React, { useState, useRef, useEffect } from "react";
import {
  FixedCropper,
  ImageRestriction,
} from "react-advanced-cropper";
import { Slider } from "./Slider";
import "react-advanced-cropper/dist/style.css";
import { Box, Grid } from "@mui/material";
import { useMainProvider } from "../../providers/MainProvider";
import {
  dataURLToFile,
  downloadPreviewImage,
  inchToPx,
} from "../../helpers/editorHelper";
import { NavigationV2 } from "./NavigationV2";
import { AdjustableCropperBackground } from "./AdjustableCropperBackground";

export const ImageEditorV2 = ({ image, onClose }) => {
  const cropperRef = useRef(null);
  const previewRef = useRef(null);
  const { updateDataImage } = useMainProvider();
  const [src, setSrc] = useState(image.preview);
  const [mode, setMode] = useState("crop");
  const [orientation, setOrientation] = useState("portrait");
  const deviceWidth = window.innerWidth;
  let width = inchToPx(image.size.width_in);
  let height = inchToPx(image.size.height_in);

  if (width > 500) {
    width = width / 4;
    height = height / 4;
  }

  if (deviceWidth < 768 && width > 300) {
    width = width / 2;
    height = height / 2;
  }

  const selectedSize = {
    width,
    height,
  };

  const [ratioValue, setRatioValue] = useState(
    image.size.width_in / image.size.height_in
  );

  const onChangeOrientation = (type) => {
    setOrientation(type);
  };

  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    hue: 0,
    saturation: 0,
    contrast: 0,
    size: selectedSize,
  });

  const onChangeValue = (value) => {
    if (mode in adjustments) {
      setAdjustments((previousValue) => ({
        ...previousValue,
        [mode]: value,
      }));
    }
  };

  const flip = (type, options) => {
    if (!cropperRef.current) {
      return;
    }
    switch (type) {
      case "horizontal":
        cropperRef.current.flipImage(true, false, options);
        break;
      case "vertical":
        cropperRef.current.flipImage(false, true, options);
        break;
      default:
        break;
    }
  };

  const rotate = (angle, options) => {
    const cropper = cropperRef.current;
    if (cropper) {
      cropper.rotateImage(angle, options);
    }
  };

  const onReset = () => {
    setMode("crop");
    setAdjustments({
      brightness: 0,
      hue: 0,
      saturation: 0,
      contrast: 0,
    });
  };

  const onUpload = (blob) => {
    onReset();
    setMode("crop");
    setSrc(blob);
  };

  const handleReadyImage = (props) => {
    const cropper = cropperRef.current;
    console.log("Cropper: ", cropper)
    if (cropper) {
      let customSize = {
        width: selectedSize.width * 3,
        height: selectedSize.height * 3,
      };

      const stencilWidth =
        orientation == "portrait" ? customSize.width : customSize.height;
      const stencilHeight =
        orientation == "portrait" ? customSize.height : customSize.width;
      
      cropper.setCoordinates({
        width: stencilWidth,
        height: stencilHeight,
        left: 0,
        top: 0,
      });
    }
  };

  const onDownload = () => {
    if (!cropperRef.current) return;

    const canvas = cropperRef.current.getCanvas();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    downloadPreviewImage(dataUrl, "edited-image.png");
  };

  const onSaveFile = () => {
    if (!cropperRef.current) return;

    const canvas = cropperRef.current.getCanvas();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const file = dataURLToFile(dataUrl, `edited-${Date.now()}.png`);
    const newData = {
      ...image,
      file: file,
      preview: URL.createObjectURL(file),
    };

    updateDataImage(image.preview, newData);
    onClose();
  };

  const onUpdate = () => {
    previewRef.current?.refresh();
  };

  const refreshImage = () => {
    cropperRef.current?.refresh();
  };

  const onZoom = (scale, options) => {
    const cropper = cropperRef.current;
    if (cropper) {
      cropper.zoomImage(scale, options);
    }
  }

  const cropperEnabled = mode === "crop";

  const refreshRatio = () => {
    const newRatioValue =
      orientation === "portrait"
        ? image.size.width_in / image.size.height_in
        : image.size.height_in / image.size.width_in;
    setRatioValue(newRatioValue);
  };

  useEffect(() => {
    setSrc();
    refreshRatio();
    refreshImage();
    setSrc(image.preview);
  }, [image]);

  useEffect(() => {
    refreshRatio();
    refreshImage();
    handleReadyImage();
  }, [orientation]);

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 7 }}>
        <Box display={"flex"} justifyContent={"center"}>
          <Box
            width={
              orientation == "portrait"
                ? selectedSize.width
                : selectedSize.height
            }
            height={
              orientation == "portrait"
                ? selectedSize.height
                : selectedSize.width
            }
            border={1}
          >
            <FixedCropper
              src={src}
              stencilSize={{
                width:
                  orientation == "portrait"
                    ? selectedSize.width
                    : selectedSize.height,
                height:
                  orientation == "portrait"
                    ? selectedSize.height
                    : selectedSize.width,
              }}
              ref={cropperRef}
              imageRestriction={ImageRestriction.none}
              stencilProps={{
                aspectRatio: ratioValue,
                movable: false,
                grid: true,
                resizable: false,
                lines: cropperEnabled,
                handlers: false,
              }}
              backgroundComponent={AdjustableCropperBackground}
              backgroundProps={adjustments}
              transformImage={{
                scale: 1,
              }}
              className="photo-id-cropper"
              onReady={handleReadyImage}
            />
            {mode !== "crop" && (
              <Slider
                className="image-editor__slider"
                value={adjustments[mode]}
                onChange={onChangeValue}
              />
            )}
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <NavigationV2
          mode={mode}
          onRotate={rotate}
          onFlip={flip}
          onChange={setMode}
          onZoom={onZoom}
          onUpload={onUpload}
          onDownload={onDownload}
          onSaveFile={onSaveFile}
          showOrientation={ratioValue !== 1 ? true : false}
          onChangeOrientation={onChangeOrientation}
          onClose={onClose}
        />
      </Grid>
    </Grid>
  );
};
