import { Box, Button } from '@mui/material'
import React from 'react'
import { useMainProvider } from '../../providers/MainProvider'
import { alertConfirmDelete, AlertStatus, showAlert } from '../../helpers/showAlert';

const ImageRemover = () => {
    const {removeImages, selectedImages } = useMainProvider();
    const handleRemoveAllSelected = async () => {
        if (selectedImages.length <= 0) {
            showAlert(AlertStatus.warning, "Failed", "Select images that you want to remove!");
            return
        }
        const confirm = await alertConfirmDelete();
        if (!confirm) {
            return;
        }
        removeImages(selectedImages);
        showAlert(AlertStatus.success, "Successfully", "");
    }
  return (
    <Box>
        <Button onClick={handleRemoveAllSelected}>Remove</Button>
    </Box>
  )
}

export default ImageRemover