import { Button, IconButton } from "@mui/material";
import React, { useRef } from "react";
import CropIcon from "@mui/icons-material/Crop";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import LightModeIcon from "@mui/icons-material/LightMode";
import TonalityIcon from "@mui/icons-material/Tonality";
import AdjustIcon from "@mui/icons-material/Adjust";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SaveIcon from "@mui/icons-material/Save";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import FlipIcon from "@mui/icons-material/Flip";

export const Navigation = ({
  onRotate,
  onFlip,
  onChange,
  onDownload,
  mode,
  onSaveFile,
  onClose,
}) => {
  const setMode = (mode) => () => {
    onChange?.(mode);
  };

  return (
    <div className="image-editor-navigation">
      <div className="image-editor-navigation__buttons">
        <IconButton
          sx={{ p: 1.5 }}
          className={"image-editor-navigation__button"}
          onClick={() => onFlip("horizontal")}
          color="primary"
        >
          <FlipIcon />
        </IconButton>
        <IconButton
          sx={{ p: 1.5 }}
          className={"image-editor-navigation__button"}
          onClick={() => onFlip("vertical")}
          color="primary"
        >
          <FlipIcon sx={{ rotate: "90deg" }} />
        </IconButton>
        <IconButton
          sx={{ p: 1.5 }}
          className={"image-editor-navigation__button"}
          color="primary"
          onClick={() => onRotate(-90)}
        >
          <RotateLeftIcon />
        </IconButton>
        <IconButton
          sx={{ p: 1.5 }}
          className={"image-editor-navigation__button"}
          color="primary"
          onClick={() => onRotate(90)}
        >
          <RotateRightIcon />
        </IconButton>
      </div>
      <div className="image-editor-navigation__buttons">
        <IconButton
          sx={{ p: 1.5 }}
          color="primary"
          className={`image-editor-navigation__button ${
            mode === "crop" ? "active" : ""
          }`}
          onClick={setMode("crop")}
        >
          <CropIcon />
        </IconButton>
        <IconButton
          sx={{ p: 1.5 }}
          color="primary"
          className={`image-editor-navigation__button ${
            mode === "saturation" ? "active" : ""
          }`}
          onClick={setMode("saturation")}
        >
          <InvertColorsIcon />
        </IconButton>
        <IconButton
          sx={{ p: 1.5 }}
          className={`image-editor-navigation__button ${
            mode === "brightness" ? "active" : ""
          }`}
          onClick={setMode("brightness")}
          color="primary"
        >
          <LightModeIcon />
        </IconButton>
        <IconButton
          sx={{ p: 1.5 }}
          className={`image-editor-navigation__button ${
            mode === "contrast" ? "active" : ""
          }`}
          onClick={setMode("contrast")}
          color="primary"
        >
          <TonalityIcon />
        </IconButton>
        <IconButton
          sx={{ p: 1.5 }}
          className={`image-editor-navigation__button ${
            mode === "hue" ? "active" : ""
          }`}
          onClick={setMode("hue")}
          color="primary"
        >
          <AdjustIcon />
        </IconButton>
      </div>
      <div className="image-editor-navigation__buttons">
        <IconButton
          sx={{ p: 1.5 }}
          className={"image-editor-navigation__button"}
          onClick={onDownload}
          color="primary"
        >
          <FileDownloadIcon />
        </IconButton>
        <Button
          className={"image-editor-navigation__button"}
          onClick={onSaveFile}
        >
          Save And Close
        </Button>
        <Button className={"image-editor-navigation__button"} onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
