import React from 'react'
import { MainProvider } from '../providers/MainProvider'
import HomeScreen from '../components/screens/HomeScreen'

const PhotoEditor = () => {
  return (
    <MainProvider>
      <HomeScreen />
    </MainProvider>
  )
}

export default PhotoEditor