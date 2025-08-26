import { Box, Button, IconButton, Tooltip } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
const ImageRemover = ({ onClickRemoveImages }) => {
  return (
    <Box>
      <Tooltip title="Delete selected photos" placement="right">
        <IconButton
          className="custom-iconbtn"
          color="success"
          onClick={onClickRemoveImages}
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ImageRemover;
