import { Box, Button } from '@mui/material'
import React from 'react'
import { useMainProvider } from '../../providers/MainProvider';
import { AlertStatus, showAlert } from '../../helpers/showAlert';
import { webApi } from '../../api';

const Tools = () => {
  const { uploadedImages } = useMainProvider();
  const handleSaveImages = async () => {
      if (uploadedImages.length <= 0) {
          showAlert(AlertStatus.warning, "Failed", "Images not found!");
          return
      }
      // handle Api to save
      const formData = new FormData();
      uploadedImages.forEach((file) => formData.append("file[]", file.file));
      const response = await webApi.savePhotos(formData);
      showAlert(AlertStatus.success, "Successfully", "");
  }
  return (  
    <Box display={'flex'} justifyContent={'flex-end'} p={2}>
      <Button onClick={handleSaveImages}>Save Images</Button>
    </Box>
  )
}

export default Tools