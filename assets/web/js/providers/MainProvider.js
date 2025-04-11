import React, { useContext, useEffect, useState } from "react";
import MainContext from "../contexts/MainContext";


export const MainProvider = ({ children }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const removeImages = (imgs) => {
    const newArrayImages = uploadedImages.filter(item => !imgs.find(img=>img.preview === item.preview));
    const newSelectedImgs = selectedImages.filter(item => !imgs.find(img=>img.preview === item.preview));
    setUploadedImages(newArrayImages);
    setSelectedImages(newSelectedImgs);
  } 

  const selectImage = (image) => {
    setSelectedImages([...selectedImages, image]);
  }

  const unSelectImage = (image) => {
    const newSelectedImgs = selectedImages.filter(item => item.preview !== image.preview);
    setSelectedImages(newSelectedImgs);
  }
  
  const value = {
    uploadedImages,
    setUploadedImages,
    removeImages,
    selectedImages,
    selectImage,
    unSelectImage
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export const useMainProvider = () => useContext(MainContext);
