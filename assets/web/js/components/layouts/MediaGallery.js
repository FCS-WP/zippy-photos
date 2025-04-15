import React from 'react'
import { useMainProvider } from '../../providers/MainProvider'
import { Box, Grid2 } from '@mui/material';
import ImageCard from './ImageCard';

const MediaGallery = () => {
  const { uploadedImages } = useMainProvider();

  return (
    <Box display={'flex'} my={4} gap={3} flexWrap={'wrap'} justifyContent={'space-around'}>
      {uploadedImages.length > 0 && uploadedImages.map((item, index) => (
        <ImageCard key={index} image={item}/>
      ))}
    </Box>
  )
}

export default MediaGallery