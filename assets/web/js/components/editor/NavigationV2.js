import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
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
import CropLandscapeIcon from "@mui/icons-material/CropLandscape";
import CropPortraitIcon from "@mui/icons-material/CropPortrait";
import FlipIcon from "@mui/icons-material/Flip";

export const NavigationV2 = ({
  onRotate,
  onFlip,
  onChange,
  onDownload,
  mode,
  onSaveFile,
  onChangeOrientation,
  showOrientation = true,
  onClose,
}) => {
  const setMode = (mode) => () => {
    onChange?.(mode);
  };

  return (
    <Box border={1} padding={3} m={3}>
      <Typography fontSize={16} fontWeight={600} mb={3} textAlign={"center"}>
        {" "}
        Edit Your Photo{" "}
      </Typography>
      <div className="image-editor-navigation__buttons">
        {showOrientation && (
          <>
            <IconButton
              sx={{
                ":hover": { backgroundColor: "#222" },
                minHeight: "auto !important",
                color: "#222",
                borderRadius: `50%`,
                fontSize: 14,
              }}
              className={"image-editor-navigation__button"}
              onClick={() => onChangeOrientation("portrait")}
              color="primary"
            >
              <CropPortraitIcon />
            </IconButton>
            <IconButton
              sx={{
                ":hover": { backgroundColor: "#222" },
                minHeight: "auto !important",
                color: "#222",
                borderRadius: `50%`,
                fontSize: 14,
              }}
              className={"image-editor-navigation__button"}
              onClick={() => onChangeOrientation("landscape")}
              color="primary"
            >
              <CropLandscapeIcon />
            </IconButton>
          </>
        )}

        <IconButton
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `50%`,
            fontSize: 14,
          }}
          className={"image-editor-navigation__button"}
          onClick={() => onFlip("horizontal")}
          color="primary"
        >
          <FlipIcon />
        </IconButton>
        <IconButton
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `50%`,
            fontSize: 14,
          }}
          className={"image-editor-navigation__button"}
          onClick={() => onFlip("vertical")}
          color="primary"
        >
          <FlipIcon sx={{ rotate: "90deg" }} />
        </IconButton>
        <IconButton
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `50%`,
            fontSize: 14,
          }}
          className={"image-editor-navigation__button"}
          color="primary"
          onClick={() => onRotate(-90)}
        >
          <RotateLeftIcon />
        </IconButton>
        <IconButton
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `50%`,
            fontSize: 14,
          }}
          className={"image-editor-navigation__button"}
          color="primary"
          onClick={() => onRotate(90)}
        >
          <RotateRightIcon />
        </IconButton>
      </div>
      <Divider sx={{ my: 2 }} />
      <div className="image-editor-navigation__buttons">
        <IconButton
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `50%`,
            fontSize: 14,
          }}
          color="primary"
          className={`image-editor-navigation__button ${
            mode === "crop" ? "active" : ""
          }`}
          onClick={setMode("crop")}
        >
          <CropIcon />
        </IconButton>
        <IconButton
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `50%`,
            fontSize: 14,
          }}
          color="primary"
          className={`image-editor-navigation__button ${
            mode === "saturation" ? "active" : ""
          }`}
          onClick={setMode("saturation")}
        >
          <InvertColorsIcon />
        </IconButton>
        <IconButton
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `50%`,
            fontSize: 14,
          }}
          className={`image-editor-navigation__button ${
            mode === "brightness" ? "active" : ""
          }`}
          onClick={setMode("brightness")}
          color="primary"
        >
          <LightModeIcon />
        </IconButton>
        <IconButton
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `50%`,
            fontSize: 14,
          }}
          className={`image-editor-navigation__button ${
            mode === "contrast" ? "active" : ""
          }`}
          onClick={setMode("contrast")}
          color="primary"
        >
          <TonalityIcon />
        </IconButton>
        <IconButton
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `50%`,
            fontSize: 14,
          }}
          className={`image-editor-navigation__button ${
            mode === "hue" ? "active" : ""
          }`}
          onClick={setMode("hue")}
          color="primary"
        >
          <AdjustIcon />
        </IconButton>
      </div>
      <Divider sx={{ my: 2 }} />
      <div className="image-editor-navigation__buttons">
        <IconButton
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `50%`,
            fontSize: 14,
          }}
          className={"image-editor-navigation__button"}
          onClick={onDownload}
          color="primary"
        >
          <FileDownloadIcon />
        </IconButton>
        <Button
          className={"image-editor-navigation__button"}
          onClick={onSaveFile}
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            fontSize: 14,
          }}
        >
          Save And Close
        </Button>
        <Button
          className={"image-editor-navigation__button"}
          onClick={onClose}
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            fontSize: 14,
          }}
        >
          Cancel
        </Button>
      </div>
    </Box>
  );
};
