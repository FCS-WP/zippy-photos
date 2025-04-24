import React from 'react'
import { useMainProvider } from '../../providers/MainProvider'
import { Box, Grid2 } from '@mui/material';
import ImageCard from './ImageCard';

const MediaGallery = () => {
  const { uploadedImages } = useMainProvider();

  return (
    <Grid2 container spacing={3}>
      {uploadedImages.length > 0 && uploadedImages.map((item) => (
        <Grid2 key={item.preview} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
         <ImageCard image={item}/>
        </Grid2>
      ))}
    </Grid2>
  )
}

export default MediaGallery