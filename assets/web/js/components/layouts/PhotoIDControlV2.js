import React from 'react'
import ControlBoxPhotoID from './ControlBoxPhotoID'
import { StyledPaper } from '../mui-custom'
import { Box, Divider } from '@mui/material'
import PhotoIDSelection from './photo-id/PhotoIDSelection'

const PhotoIDControlV2 = () => {
  
  return (
    <>
      <PhotoIDSelection />
      <Divider sx={{ borderColor: '#333' }} />
      <Box mt={2}>
        <ControlBoxPhotoID />
      </Box>
    </>
  )
}

export default PhotoIDControlV2