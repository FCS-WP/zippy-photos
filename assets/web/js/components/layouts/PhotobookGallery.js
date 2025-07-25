import React from "react";
import { usePhotobookProvider } from "../../providers/PhotobookProvider";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Grid,
  IconButton,
  Input,
  Tooltip,
  Typography,
} from "@mui/material";
import { alertConfirmDelete } from "../../helpers/showAlert";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const PhotobookGallery = () => {
  const {
    uploadedImages,
    removeImages,
    updatePhotobookDataImage,
    setUploadedImages,
  } = usePhotobookProvider();

  const handleDelete = async (item) => {
    const confirm = await alertConfirmDelete();
    if (!confirm) {
      return;
    }
    removeImages([item]);
  };

  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= uploadedImages.length) return;

    const newImages = [...uploadedImages];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setUploadedImages(newImages);
  };

  const changePrevOrder = (image) => {
    const index = uploadedImages.findIndex(
      (img) => img.preview === image.preview
    );
    moveImage(index, index - 1);
  };

  const changeNextOrder = (image) => {
    const index = uploadedImages.findIndex(
      (img) => img.preview === image.preview
    );
    moveImage(index, index + 1);
  };

  const changeFirstOrder = (image) => {
    const index = uploadedImages.findIndex(
      (img) => img.preview === image.preview
    );
    moveImage(index, 0);
  };

  const changeLastOrder = (image) => {
    const index = uploadedImages.findIndex(
      (img) => img.preview === image.preview
    );
    moveImage(index, uploadedImages.length - 1);
  };

  const handleChangeNo = (image, type) => {
    switch (type) {
      case "prev":
        changePrevOrder(image);
        break;
      case "next":
        changeNextOrder(image);
        break;
      case "first":
        changeFirstOrder(image);
        break;
      case "last":
        changeLastOrder(image);
        break;
      default:
        console.log("Unknown type:", type);
    }
  };

  return (
    <>
      <Typography fontSize={14} mb={2} fontWeight={500}>
        Photobook Images
      </Typography>
      {uploadedImages.length != 0 && (
        <Grid
          border={"1px solid #e1e1e1"}
          position={"relative"}
          mb={2}
          p={3}
          maxHeight={400}
          sx={{ overflowY: "scroll" }}
          container
          spacing={3}
        >
          {uploadedImages.map((item, index) => (
            <Grid size={{ xs: 6, lg: 4 }} key={item.preview}>
              <Box
                mb={"5px"}
                gap={1}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography>{index + 1}</Typography>

                {/* Box slot order */}
                <Box display={"flex"} gap={1}>
                  <Tooltip title="Move photo to first slot">
                    <IconButton
                      className="ibtn-custom"
                      sx={{ minHeight: 0, p: 0 }}
                      aria-label="delete"
                      onClick={() => handleChangeNo(item, "first")}
                    >
                      <FirstPageIcon color="primary" fontSize="12" />
                    </IconButton>
                  </Tooltip>
                  {/*  */}
                  <Tooltip title="Move photo to previous slot">
                    <IconButton
                      className="ibtn-custom"
                      sx={{ minHeight: 0, p: 0 }}
                      aria-label="delete"
                      onClick={() => handleChangeNo(item, "prev")}
                    >
                      <NavigateBeforeIcon color="primary" fontSize="12" />
                    </IconButton>
                  </Tooltip>
                  {/*  */}
                  <Tooltip title="Move photo to next slot">
                    <IconButton
                      className="ibtn-custom"
                      sx={{ minHeight: 0, p: 0 }}
                      aria-label="delete"
                      onClick={() => handleChangeNo(item, "next")}
                    >
                      <NavigateNextIcon color="primary" fontSize="12" />
                    </IconButton>
                  </Tooltip>
                  {/* Order end */}
                  <Tooltip title="Move photo to last slot">
                    <IconButton
                      className="ibtn-custom"
                      sx={{ minHeight: 0, p: 0 }}
                      aria-label="delete"
                      onClick={() => handleChangeNo(item, "last")}
                    >
                      <LastPageIcon color="primary" fontSize="12" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <IconButton
                  className="ibtn-custom"
                  sx={{ minHeight: 0, p: 0 }}
                  aria-label="delete"
                  onClick={() => handleDelete(item)}
                >
                  <ClearIcon color="primary" fontSize="16" />
                </IconButton>
              </Box>
              <Box
                border={"1px solid #f5f5f5"}
                width={"100%"}
                height={150}
                padding={"10px"}
                display={"flex"}
                justifyContent={"center"}
              >
                <img
                  className="object-fit-contain"
                  src={item.preview}
                  alt="item"
                  width={"100%"}
                  height={"100%"}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default PhotobookGallery;
