import React, { useContext, useEffect, useState } from "react";
import { PhotoIDContext } from "../contexts/MainContext";
import { photoIDApi } from "../api";
import { toast } from "react-toastify";

export const PhotoIDProvider = ({ children }) => {
  const params = new URLSearchParams(window.location.search);
  const data = Object.fromEntries(params.entries());

  const [state, setState] = useState({
    productData: null,
    isApiLoading: true,
    uploadedImage: null,
    selectedVariation: null,
    cropper: null,
    urlData: data
  });

  const { productData, isApiLoading, uploadedImage, cropper, urlData, selectedVariation } = state;

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  const initDataProducts = async () => {
    const params = {
      product_id : data.product_id,
      variation_id: data.variation_id,
    }
    const { data: response } = await photoIDApi.getDataProduct(params);
    if (!response) {
      console.error("Can not get products");
      toast.error('Can not create photo now. Try again later!!!');
      return;
    }

    updateState({ productData: response.result });
  };

  useEffect(() => {
    const initData = async () => {
      updateState({ isApiLoading: true });

      await initDataProducts();
      setTimeout(() => {
        updateState({ isApiLoading: false });
      }, 1500);
    };
    initData();

    return () => {};
  }, []);

  const value = {
    productData,
    cropper,
    selectedVariation,
    urlData,
    isApiLoading,
    uploadedImage,
    updateState,
  };

  return (
    <PhotoIDContext.Provider value={value}>{children}</PhotoIDContext.Provider>
  );
};

export const usePhotoIDProvider = () => useContext(PhotoIDContext);
