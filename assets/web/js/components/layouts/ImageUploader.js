import React from "react";
import { Button, Box, IconButton, Tooltip } from "@mui/material";
import { useMainProvider } from "../../providers/MainProvider";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const ImageUploader = ({ onChangeImages, showText = false }) => {
  return (
    <Box>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onChangeImages}
        id="imageUpload"
        style={{ display: "none" }}
      />
      <Tooltip title="Upload photos" placement="right">
        <IconButton
          className="custom-iconbtn"
          onClick={() => document.getElementById("imageUpload").click()}
          sx={{
            ":hover": { backgroundColor: "#222" },
            minHeight: "auto !important",
            color: "#222",
            borderRadius: `${showText ? 0 :'50%' }`,
            fontSize: 14
          }}
        >
          <UploadFileIcon sx={{ mx: `${showText ? '5px' : 0 }` }}/>
           {showText && ("Upload from devices")}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ImageUploader;
