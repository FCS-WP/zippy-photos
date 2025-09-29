import { Box, Typography } from "@mui/material";
import React from "react";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";

const PhotoIDDesc = () => {
  const { productData } = usePhotoIDProvider();
  const HtmlContent = ({ htmlString }) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  return (
    <Box className="photo-id-box" fontSize={14} width={"100%"}>
      {!!productData.description ? (
        <HtmlContent htmlString={productData.description} />
      ) : (
        <Typography fontSize={14}>
          <Box textAlign={"center"}>
            <Typography variant="h5" fontWeight={700} color="secondary">
              WELCOME TO MACH PHOTO
            </Typography>
            <Typography variant="h6">Create Your Photo ID</Typography>
          </Box>
        </Typography>
      )}
    </Box>
  );
};

export default PhotoIDDesc;
