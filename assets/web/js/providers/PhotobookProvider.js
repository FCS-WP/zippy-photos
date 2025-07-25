import React, { useContext, useEffect, useState } from "react";
import { PhotobookContext } from "../contexts/MainContext";

export const PhotobookProvider = ({ children }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isAppLoading, setIsAppLoading] = useState(false);
  const [isATCDisabled, setIsATCDisabled] = useState(true);

  const removeImages = (imgs) => {
    const newArrayImages = uploadedImages.filter(
      (item) => !imgs.find((img) => img.preview === item.preview)
    );
    setUploadedImages(newArrayImages);
  };

  const selectImage = (image) => {
    setSelectedImages([...selectedImages, image]);
  };

  const updatePhotobookDataImage = (previewUrl, newImageData) => {
    const updatedData = uploadedImages.map((item) => {
      if (item.preview === previewUrl) {
        return newImageData;
      }
      return item;
    });

    setUploadedImages(updatedData);
  };

  const triggerUpdateData = () => {
    if (selectedImages.length > 0) {
      const updateList = uploadedImages.filter((item) =>
        selectedImages.find((sItem) => sItem.preview === item.preview)
      );
      setSelectedImages(updateList);
    }
  };

  useEffect(() => {
    triggerUpdateData();
    return () => {};
  }, [uploadedImages]);

  useEffect(() => {
    return () => {};
  }, []);

  const value = {
    isAppLoading,
    uploadedImages,
    isATCDisabled,
    setIsATCDisabled,
    removeImages,
    setIsAppLoading,
    setUploadedImages,
    updatePhotobookDataImage
  };

  return (
    <PhotobookContext.Provider value={value}>
      {children}
    </PhotobookContext.Provider>
  );
};

export const usePhotobookProvider = () => useContext(PhotobookContext);
