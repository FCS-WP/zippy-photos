import React, { useContext, useEffect, useState } from "react";
import MainContext from "../contexts/MainContext";
import { webApi } from "../api";

export const MainProvider = ({ children }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [photoSizes, setPhotoSizes] = useState([]);
  const [croppedFiles, setCroppedFiles] = useState([]);

  const getPhotoSizes = async () => {
    const res = await webApi.getSizes();
    if (res.data.status === "success") {
      setPhotoSizes(res.data.sizes);
    }
  };

  const updateCroppedFiles = (preview, file) => {
    const newArray = croppedFiles.map((item) => {
      console.log(item.preview !== preview);
    });
    newArray.push({
      preview: preview,
      file: file,
    });
    setCroppedFiles(newArray);
  };

  const removeImages = (imgs) => {
    const newArrayImages = uploadedImages.filter(
      (item) => !imgs.find((img) => img.preview === item.preview)
    );
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

  useEffect(() => {
    console.log("croppedFiles", croppedFiles);
    return () => {};
  }, [croppedFiles]);

  useEffect(() => {
    getPhotoSizes();
    return () => {};
  }, []);

  const value = {
    photoSizes,
    uploadedImages,
    selectedImages,
    setUploadedImages,
    removeImages,
    selectImage,
    unSelectImage,
    updateDataImage,
    updateCroppedFiles,
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export const useMainProvider = () => useContext(MainContext);
