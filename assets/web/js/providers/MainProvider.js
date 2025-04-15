import React, { useContext, useEffect, useState } from "react";
import MainContext from "../contexts/MainContext";

export const MainProvider = ({ children }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const removeImages = (imgs) => {
    const newArrayImages = uploadedImages.filter(
      (item) => !imgs.find((img) => img.preview === item.preview)
    );
    setUploadedImages(newArrayImages);
  };

  const updateImageList = (image, editedImageFile) => {
    const newImage = {
      ...image,
      file: editedImageFile,
      preview: URL.createObjectURL(editedImageFile),
    };
    const newArrayImages = uploadedImages.filter(
      (item) => image.preview !== item.preview
    );
    newArrayImages.push(newImage);
    setUploadedImages(newArrayImages);
  };

  const selectImage = (image) => {
    setSelectedImages([...selectedImages, image]);
  };

  const unSelectImage = (image) => {
    const newSelectedImgs = selectedImages.filter(
      (item) => item.preview !== image.preview
    );
    setSelectedImages(newSelectedImgs);
  };

  const updateDataImage = (previewUrl, newImageData) => {
    const updatedData = uploadedImages.map((item) => {
      if (item.preview === previewUrl) {
        return newImageData;
      }
      return item;
    });

    setUploadedImages(updatedData);
  };

  const triggerUpdateSelectedList = () => {
    if (selectedImages.length > 0) {
      const updateList = uploadedImages.filter((item) =>
        selectedImages.find((sItem) => sItem.preview === item.preview)
      );
      setSelectedImages(updateList);
    }
  };

  useEffect(() => {
    triggerUpdateSelectedList();
    return () => {};
  }, [uploadedImages]);

  const value = {
    uploadedImages,
    setUploadedImages,
    removeImages,
    selectedImages,
    selectImage,
    unSelectImage,
    updateImageList,
    updateDataImage,
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export const useMainProvider = () => useContext(MainContext);
