import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMainProvider } from "../../providers/MainProvider";

const BulkSidebar = () => {
  const { photoSizes, uploadedImages, setUploadedImages } = useMainProvider();
  const [bulkSize, setBulkSize] = useState(photoSizes[0] ?? "");
  const [bulkPaper, setBulkPaper] = useState("");
  const [isBulkSizeDisabled, setIsBulkSizeDisabled] = useState(true);
  const [isBulkPaperTypeDisabled, setIsBulkPaperTypeDisabled] = useState(true);

  const handleBulkSize = () => {
    const updatedArr = uploadedImages.map(item=>{
      return {...item, size: bulkSize};
    })

    setUploadedImages(updatedArr);
  };

  const handleBulkPaperType = () => {
    const updatedArr = uploadedImages.map(item=>{
      return {...item, paper: bulkPaper};
    })
    setUploadedImages(updatedArr);
  };
  
  useEffect(()=>{
    if (bulkPaper) {
      setIsBulkPaperTypeDisabled(false);
    }
  }, [bulkPaper])

   useEffect(()=>{
    if (bulkSize) {
      setIsBulkSizeDisabled(false);
    }
  }, [bulkSize])

  return (
    <Box>
      <Typography
        color="black"
        variant="h6"
        fontSize={16}
        textAlign={"center"}
      >
        Bulk Action
      </Typography>
      {/* Bulk Paper Type */}
      <Box mt={2} mb={3} gap={3} alignItems={"center"} pb={2}>
        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel
            sx={{ background: "#fff", px: 1 }}
            id="label-bulk-paper-type"
          >
            Paper Type
          </InputLabel>
          <Select
            labelId="label-bulk-paper-type"
            id="paper-type"
            size="small"
            variant="outlined"
            value={bulkPaper}
            sx={{ p: "6px" }}
            onChange={(e) => setBulkPaper(e.target.value)}
          >
            <MenuItem value={"Matte"}>Matte</MenuItem>
            <MenuItem value={"Glossy"}>Glossy</MenuItem>
          </Select>
        </FormControl>
        <Box textAlign={"end"}>
          <Button
            variant="contained"
            color="info"
            sx={{ minHeight: "auto" }}
            size="small"
            onClick={handleBulkPaperType}
            disabled={isBulkPaperTypeDisabled}
          >
            Apply to all
          </Button>
        </Box>
      </Box>

      {/* Bulk Image Size */}
      <Box pb={2}>
        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel sx={{ background: "#fff", px: 1 }} id="label-bulk-size">
            Photo Size
          </InputLabel>
          <Select
            labelId="label-bulk-size"
            id="size"
            size="small"
            variant="outlined"
            value={bulkSize}
            sx={{ p: "6px" }}
            onChange={(e)=>setBulkSize(e.target.value)}
          >
            {photoSizes.map((photoSize) => (
              <MenuItem key={photoSize.id} value={photoSize}>
                {photoSize.name + " . " + photoSize.display_price}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box textAlign={"end"}>
          <Button
            variant="contained"
            disabled={isBulkSizeDisabled}
            color="info"
            sx={{ minHeight: "auto" }}
            size="small"
            onClick={handleBulkSize}
          >
            Apply to all
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BulkSidebar;
