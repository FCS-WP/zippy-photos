import React, { useEffect } from 'react'
import { useMainProvider } from '../../providers/MainProvider'
import { Grid2 } from '@mui/material';
import ImageCard from './ImageCard';

const MediaGallery = () => {
  const { uploadedImages } = useMainProvider();

  return (
    <Grid2 container my={4} spacing={3}>
      {uploadedImages.length > 0 && uploadedImages.map((item, index) => (
        <ImageCard key={index} image={item}/>
      ))}
    </Grid2>
  )
}

export default MediaGallery