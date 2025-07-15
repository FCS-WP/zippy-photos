import React from "react";
import { usePhotobookProvider } from "../../providers/PhotobookProvider";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, IconButton, Typography } from "@mui/material";
import { alertConfirmDelete } from "../../helpers/showAlert";

const PhotobookGallery = () => {
  const { uploadedImages, setUploadedImages, removeImages } =
    usePhotobookProvider();
  const handleDelete = async (item) => {
    const confirm = await alertConfirmDelete();
    if (!confirm) {
      return;
    }
    removeImages([item]);
  };

  const getImageLimit = () => {};

  return (
    <>
      <Typography fontSize={14} mb={2} fontWeight={500}>
        Photobook Images
      </Typography>
      {uploadedImages.length != 0 && (
        <Box
          padding={3}
          border={"1px solid #e1e1e1"}
          display={"flex"}
          position={"relative"}
          flexWrap={"wrap"}
          mb={2}
          maxHeight={220}
          sx={{ overflowY: "scroll", rowGap: "20px", columnGap: "30px" }}
        >
          {uploadedImages.map((item, index) => (
            <Box key={item.preview}>
              <Box
                mb={"5px"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography>{index + 1}</Typography>
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
                width={100}
                height={100}
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
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default PhotobookGallery;
