import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Cropper,
  CropperWrapper,
  DraggableElement,
  FixedCropper,
  ImageRestriction,
  RectangleStencil,
} from "react-advanced-cropper";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";
import { mmToPx } from "../../helpers/editorHelper";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { toast } from "react-toastify";

const PhotoIDCropper = ({ image }) => {
  const { productData, updateState } = usePhotoIDProvider();
  const [src, setSrc] = useState(image?.preview);
  const templateURL = productData?.variation_data.template;
  const cropperRef = useRef(null);
  const uploaderRef = useRef(null);
  const [prepareData, setPrepareData] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  const defaultSize = {
    width: productData?.variation_data.width
      ? mmToPx(productData?.variation_data.width)
      : 400,
    height: productData?.variation_data.height
      ? mmToPx(productData?.variation_data.height)
      : 600,
  };

  const handleReadyImage = () => {
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
      const adjustLeft = await getAdjustmentLeft();
      const left = (adjustLeft.width - adjustLeft.width * ratio) / 2;

      cropper.setCoordinates({
        width: cropper.getCoordinates().width,
        height: cropper.getCoordinates().height,
        left: left,
        top: 0,
      });

      setPrepareData(false);
    }, 1000);
  };

  const getAdjustmentLeft = () => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = image.preview;

      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };

      img.onerror = (err) => reject(err);
    });
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
    const previewElement = document.querySelector(
      ".advanced-cropper-rectangle-stencil__preview"
    );
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

  return (
    <>
      <input
        type="file"
        style={{ display: "none" }}
        onChange={handleFileSelect}
        accept="image/*"
        ref={uploaderRef}
      />
      <Box
        height={defaultSize.height}
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
              movable: true,
              resizable: true,
            }}
            stencilSize={defaultSize}
            transformImage={{
              scale: 1,
            }}
            onReady={handleReadyImage}
            imageRestriction={ImageRestriction.fitArea}
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
              <Typography variant="h4" width={"100%"}>
                Drop or ppload your photo to continue
              </Typography>
              <Box sx={{
                textAlign: 'center',
                pt: 2
              }}>
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
                  <UploadFileIcon sx={{ mr: 1 }}/> Upload now
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box className="d-none">
        <Button onClick={handleDownloadImage}>Export Image</Button>
      </Box>
    </>
  );
};

export default PhotoIDCropper;
