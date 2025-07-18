import { Box, Button, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useMainProvider } from "../../providers/MainProvider";
import {
  alertConfirmDelete,
  AlertStatus,
  showAlert,
} from "../../helpers/showAlert";
import DeleteIcon from "@mui/icons-material/Delete";
const ImageRemover = () => {
  const { removeImages, selectedImages } = useMainProvider();
  const handleRemoveAllSelected = async () => {
    if (selectedImages.length <= 0) {
      showAlert(
        AlertStatus.warning,
        "Failed",
        "Select images that you want to remove!"
      );
      return;
    }
    const confirm = await alertConfirmDelete();
    if (!confirm) {
      return;
    }
    removeImages(selectedImages);
    showAlert(AlertStatus.success, "Successfully", "");
  };
  return (
    <Box>
      <Tooltip title="Delete selected photos"  placement="right">
        <IconButton
          className="custom-iconbtn"
          color="success"
          onClick={handleRemoveAllSelected}
          sx={{ ":hover": {backgroundColor: '#222'}, minHeight: 'auto !important', color: '#222'}}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ImageRemover;
