import { Box, LinearProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const PhotobookProcessBar = (props) => {
  const { totalItem, currentValue } = props;
  const percentValue = Math.round((currentValue / totalItem) * 100);
  const [barType, setBarType] = useState("indeterminate");

  useEffect(() => {
    if (barType == "determinate") return;
    if (currentValue > 0) {
      setBarType("determinate");
    }
  }, [currentValue]);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        variant={barType}
        color="info"
        sx={{ height: 10, borderRadius: 5 }}
        value={percentValue}
      />
      <Box mt={1}>
        <Typography fontWeight={500} textAlign={"center"}>
          {currentValue} / {totalItem} files uploaded.
        </Typography>
      </Box>
    </Box>
  );
};

export default PhotobookProcessBar;
