import { Box, Button } from '@mui/material'
import React from 'react'
import { useMainProvider } from '../../providers/MainProvider';
import { AlertStatus, showAlert } from '../../helpers/showAlert';

const Tools = () => {
  const { uploadedImages } = useMainProvider();
  const handleSaveImages = async () => {
      if (uploadedImages.length <= 0) {
          showAlert(AlertStatus.warning, "Failed", "Images not found!");
          return
      }
      // handle Api to save
      showAlert(AlertStatus.success, "Successfully", "");
  }
  return (  
    <Box display={'flex'} justifyContent={'flex-end'} p={2}>
      <Button onClick={handleSaveImages}>Save Images</Button>
    </Box>
  )
}

export default Tools