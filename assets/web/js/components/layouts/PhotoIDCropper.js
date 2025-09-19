import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  FixedCropper,
  ImageRestriction,
} from "react-advanced-cropper";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";
import { mmToPx } from "../../helpers/editorHelper";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { toast } from "react-toastify";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import DeleteIcon from "@mui/icons-material/Delete";
import { alertConfirmDelete } from "../../helpers/showAlert";

const PhotoIDCropper = ({ image }) => {
  const { productData, updateState } = usePhotoIDProvider();
  const [src, setSrc] = useState(image?.preview);
  const templateURL = productData?.template?.url;
  const cropperRef = useRef(null);
  const uploaderRef = useRef(null);
  const [prepareData, setPrepareData] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  const defaultSize = {
    width: productData?.template?.width
      ? mmToPx(productData?.template?.width)
      : 400,
    height: productData?.template?.height
      ? mmToPx(productData?.template?.height)
      : 600,
  };

  const handleReadyImage = (props) => {
    const cropper = cropperRef.current;
    const ratio = defaultSize.width / defaultSize.height;
    if (cropper) {
      const stencilWidth = defaultSize.width * 3;
      const stencilHeight = defaultSize.height * 3;

      cropper.setCoordinates({
        width: stencilWidth,
        height: stencilHeight,
        left: 0,
        top: 0,
      });
    }

    setTimeout(async () => {
      addElementToPreviewCropper();
      /**
       *
       * If imageRestriction.none => Use this code
       *  const image = cropper.getImage();
       *  let scale = cropper.getCoordinates().width / image.width;
       *  cropper.transformImage({ scale: scale })
       *
       **/

      cropper.setCoordinates({
        width: cropper.getCoordinates().width,
        height: cropper.getCoordinates().height,
        left: 0,
        top: 0,
      });

      setPrepareData(false);
    }, 1000);
  };

  const handleZoomImage = (scale, options) => {
    const cropper = cropperRef.current;
    if (cropper) {
      cropper.zoomImage(scale, options);
    }
  };

  const handleDownloadImage = () => {
    if (!cropperRef.current) return;

    const canvas = cropperRef.current.getCanvas({
      width: defaultSize.width * 2,
      height: defaultSize.height * 2,
    });

    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    downloadPreviewImage(dataUrl, "mach-photo-image.png");
  };

  const downloadPreviewImage = (dataUrl, filename = "download.jpg") => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setSrc(image?.preview);
  }, [image]);

  const addElementToPreviewCropper = () => {
    if (!templateURL) {
      return;
    }
    const previewElement = document.querySelector(
      ".advanced-cropper-rectangle-stencil__preview"
    );
    previewElement.innerHTML = "";
    const image = document.createElement("img");
    image.src = templateURL;
    image.alt = "";
    image.className = "stencil-template";
    previewElement.appendChild(image);
  };

  const handleChangeCropper = () => {
    const cropper = cropperRef.current;
    updateState({ cropper: cropper });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    handleUploadFile(file);
  };

  const triggerUpload = () => {
    uploaderRef.current.click();
  };

  const handleUploadFile = (file) => {
    if (file.type.startsWith("image/")) {
      updateState({
        uploadedImage: {
          file: file,
          preview: URL.createObjectURL(file),
        },
      });
      return;
    } else {
      toast.error("Only support image file.");
      return;
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleUploadFile(file);
  };

  const handleDeleteImage = async (e) => {
    const confirm = await alertConfirmDelete();
    if (confirm) {
      updateState({ uploadedImage: null, cropper: null });
      uploaderRef.current.value = null;
    }
  };

  return (
    <Box
      minWidth={defaultSize.width}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
    >
      <input
        type="file"
        style={{ display: "none" }}
        onChange={handleFileSelect}
        accept="image/*"
        ref={uploaderRef}
      />
      <Box
        height={defaultSize.height}
        width={defaultSize.width}
        sx={{
          position: "relative",
          border: dragOver ? "2px dashed #1976d2" : "2px solid #ccc",
          overflow: "hidden",
          backgroundColor: dragOver ? "#e3f2fd" : "#f0f0f0",
          transition: "0.3s",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {image ? (
          <FixedCropper
            ref={cropperRef}
            src={src}
            stencilProps={{
              aspectRatio: defaultSize.width / defaultSize.height,
              handlers: false,
              lines: false,
              movable: false,
              resizable: false,
            }}
            stencilSize={defaultSize}
            transformImage={{
              scale: 1,
            }}
            onReady={handleReadyImage}
            imageRestriction={ImageRestriction.stencil}
            className="photo-id-cropper"
            onChange={handleChangeCropper}
          />
        ) : (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            sx={{
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography variant="h6" width={"100%"} textAlign={"center"}>
                Drop or upload your photo to continue
              </Typography>
              <Box
                sx={{
                  textAlign: "center",
                  pt: 2,
                }}
              >
                <IconButton
                  onClick={triggerUpload}
                  sx={{
                    ":hover": { backgroundColor: "#222" },
                    backgroundColor: "#fff",
                    minHeight: "auto !important",
                    color: "#222",
                    fontSize: 14,
                    px: 3,
                    borderRadius: 1,
                  }}
                >
                  <UploadFileIcon sx={{ mr: 1 }} /> Upload now
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      {image && (
        <Box
          width={"100%"}
          display={"flex"}
          py={1}
          justifyContent={"space-between"}
        >
          <Box display={"flex"} gap={2}>
            <IconButton
              sx={{
                ":hover": { backgroundColor: "#222" },
                minHeight: "auto !important",
                color: "#222",
                borderRadius: `50%`,
                fontSize: 14,
              }}
              onClick={() => handleZoomImage(1.1)}
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
              onClick={() => handleZoomImage(0.9)}
              color="primary"
            >
              <ZoomOutIcon />
            </IconButton>
          </Box>

          <IconButton
            sx={{
              ":hover": { backgroundColor: "#222" },
              minHeight: "auto !important",
              color: "#222",
              borderRadius: `50%`,
              fontSize: 14,
            }}
            onClick={() => handleDeleteImage()}
            color="primary"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}

      <Box className="d-none">
        <Button onClick={handleDownloadImage}>Export Image</Button>
      </Box>
    </Box>
  );
};

export default PhotoIDCropper;
