import React, { useContext, useEffect, useState } from "react";
import { PhotoIDContext } from "../contexts/MainContext";
import { photoIDApi } from "../api";

export const PhotoIDProvider = ({ children }) => {
  const [state, setState] = useState({
    products: [],
    isApiLoading: true,
  });

  const { products, isApiLoading } = state;

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  const initDataProducts = async () => {
    const { data: response } = await photoIDApi.getProducts();
    if (!response) {
      console.error("Can not get products");
    }
    updateState({ products: response.result });
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
    products,
    isApiLoading,
    updateState,
  };

  return (
    <PhotoIDContext.Provider value={value}>{children}</PhotoIDContext.Provider>
  );
};

export const usePhotoIDProvider = () => useContext(PhotoIDContext);
