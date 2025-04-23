import React, { useState, useRef, useEffect } from "react";
import cn from "classnames";
import {
  Cropper,
  CropperPreview,
  ImageRestriction,
} from "react-advanced-cropper";
import { Navigation } from "./Navigation";
import { Slider } from "./Slider";
import "react-advanced-cropper/dist/style.css";
import { Button, IconButton } from "@mui/material";
import { AdjustableCropperBackground } from "./AdjustableCropperBackground";
import { AdjustablePreviewBackground } from "./AdjustablePreviewBackground";
import { useMainProvider } from "../../providers/MainProvider";
import RestoreIcon from "@mui/icons-material/Restore";
import { dataURLToFile, downloadPreviewImage, inchToPx } from "../../helpers/editorHelper";

export const ImageEditor = ({ image, onClose }) => {
  const cropperRef = useRef(null);
  const previewRef = useRef(null);
  const { updateDataImage, updateCroppedFiles } = useMainProvider();
  const [src, setSrc] = useState(image.preview);
  const [mode, setMode] = useState("crop");
  const [ratioValue, setRatioValue] = useState(
    image.size.width_in / image.size.height_in
  );

  const selectedSize = {
    width: inchToPx(image.size.width_in),
    height: inchToPx(image.size.height_in),
  };

  const onChangeOrientation = (type) => {
    const newRatioValue =
      type === "portrait"
        ? image.size.width_in / image.size.height_in
        : image.size.height_in / image.size.width_in;
    setRatioValue(newRatioValue);
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

  const handleImageLoad = () => {
    const cropper = cropperRef.current;
    if (cropper && cropper.isLoaded()) {
      const imageSize = cropper.getVisibleArea();

      if (imageSize) {
        const fullWidth = imageSize.width;
        const fullHeight = fullWidth / ratioValue;

        let top = 0;
        let height = fullHeight;
        height = imageSize.height;
        top = 0;
        const adjustedWidth = height * ratioValue;
        const left = (imageSize.width - adjustedWidth) / 2;

        cropper.setCoordinates({
          width: adjustedWidth,
          height: height,
          left,
          top,
        });
      }
    }
  };

  const onDownload = () => {
    if (!cropperRef.current) return;

    const canvas = cropperRef.current.getCanvas();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/jpeg");
    downloadPreviewImage(dataUrl, "edited-image.jpg");
  };


  const onSaveFile = () => {
    if (!cropperRef.current) return;

    const canvas = cropperRef.current.getCanvas();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/jpeg");
    const file = dataURLToFile(dataUrl, `edited-${Date.now()}.jpg`);
    const newData = {
      ...image,
      file: file,
      preview: URL.createObjectURL(file),
    }
    
    // updateCroppedFiles(image.preview, null, 'remove');
    // updateCroppedFiles(newData.preview, file, 'add');
   
    updateDataImage(image.preview, newData);
    onClose();
  };


  const onUpdate = () => {
    previewRef.current?.refresh();
  };

  const changed = Object.values(adjustments).some((el) => Math.floor(el * 100));

  const cropperEnabled = mode === "crop";

  useEffect(() => {
    setSrc(image.preview);
  }, [image]);

  return (
    <div className={"image-editor"}>
      <div className="image-editor__cropper">
        <Cropper
          src={src}
          ref={cropperRef}
          sizeRestrictions={ImageRestriction.stencil}
          stencilProps={{
            aspectRatio: ratioValue,
            movable: cropperEnabled,
            grid: true,
            resizable: true,
            lines: cropperEnabled,
            handlers: cropperEnabled,
            overlayClassName: cn(
              "image-editor__cropper-overlay",
              !cropperEnabled && "image-editor__cropper-overlay--faded"
            ),
          }}
          backgroundComponent={AdjustableCropperBackground}
          backgroundWrapperProps={{
            scaleImage: cropperEnabled,
            moveImage: cropperEnabled,
          }}
          backgroundProps={adjustments}
          onUpdate={onUpdate}
          onReady={handleImageLoad}
        />
        {mode !== "crop" && (
          <Slider
            className="image-editor__slider"
            value={adjustments[mode]}
            onChange={onChangeValue}
          />
        )}
        <CropperPreview
          className={"custom-cropper-preview"}
          ref={previewRef}
          cropper={cropperRef}
          backgroundComponent={AdjustablePreviewBackground}
          backgroundProps={adjustments}
        />
        <IconButton
          color="primary"
          className="image-editor_reset"
          onClick={onReset}
        >
          <RestoreIcon />
        </IconButton>
      </div>
      <Navigation
        mode={mode}
        onRotate={rotate}
        onFlip={flip}
        onChange={setMode}
        onUpload={onUpload}
        onDownload={onDownload}
        onSaveFile={onSaveFile}
        showOrientation={ratioValue !== 1 ? true : false}
        onChangeOrientation={onChangeOrientation}
        onClose={onClose}
      />
    </div>
  );
};
