import React, { useEffect, useState } from "react";
import PhotobookUploader from "../components/layouts/PhotobookUploader";
import { PhotobookProvider } from "../providers/PhotobookProvider";
import PhotobookGallery from "../components/layouts/PhotobookGallery";
import { webApi } from "../api";
import PhotobookAddToCart from "../components/layouts/PhotobookAddToCart";
import DefaultWPButton from "../components/layouts/DefaultWPButton";

const PhotobookSingle = ({
  productId,
  variationId,
  productType = "simple",
}) => {
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [limitPhotos, setLimitPhotos] = useState();
  const [isShowDefaultBtn, setIsShowDefaultBtn] = useState(false);

  useEffect(() => {
    const getDataPhotobook = async () => {
      let condition1 = productType === "simple";
      let condition2 = productId && variationId;

      if (condition1 || condition2) {
        // Call Api
        const getPhotobookConfig = await webApi.getPhotobookConfig({
          product_id: productId,
          variation_id: variationId || -1,
          product_type: productType,
        });
        const response = getPhotobookConfig.data;
        if (response.status === 'success' && response.result) {
          setLimitPhotos({
            min: response.result.min_photos,
            max: response.result.max_photos,
          })
          setShowUploadButton(true);
          return;
        }

        if (response.status === 'failed') {
          setIsShowDefaultBtn(true);
        }
      }
    };

    getDataPhotobook();

    return () => {};
  }, [variationId]);
  // check is available uploadImages

  return (
    <PhotobookProvider>
      {showUploadButton ? (
        <>
          <PhotobookGallery />
          <PhotobookUploader limitPhotos={limitPhotos}/>
          <PhotobookAddToCart />
        </>
      ) : (
        <>
          <DefaultWPButton />
        </>
      )}
    </PhotobookProvider>
  );
};

export default PhotobookSingle;
