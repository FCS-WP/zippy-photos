import { Box, Button, IconButton, Tooltip } from "@mui/material";
import React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const ImageDownloader = ({ onClickDownload }) => {
  return (
    <Box>
      <Tooltip title="Download selected photos" placement="right">
        <IconButton
          className="custom-iconbtn"
          onClick={onClickDownload}
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
          }}
        >
          <FileDownloadIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ImageDownloader;
