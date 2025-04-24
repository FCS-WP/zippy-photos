import React, { useCallback, useEffect, useRef, useState } from "react";
import { Cropper, ImageRestriction } from "react-advanced-cropper";
import { useMainProvider } from "../../providers/MainProvider";
import { dataURLToFile } from "../../helpers/editorHelper";
import { debounce } from "../../helpers/debounce";

const MiniCropper = ({ image, orientation }) => {
  const cropperRef = useRef(null);
  const previewRef = useRef(null);
  const { updateDataImage, updateCroppedFiles } = useMainProvider();
  const [src, setSrc] = useState(image.preview);
  const [ratioValue, setRatioValue] = useState(
    image.size.width_in / image.size.height_in
  );

  const onUpdate = () => {
    previewRef.current?.refresh();
    debounceUpdateCroppedPhoto();
  };

  const debounceUpdateCroppedPhoto = useCallback(
    debounce(() => {
      handleLoadCroppedImage();
    }, 1000),
    []
  );

  const refreshRatio = () => {
    const newRatioValue =
      orientation === "portrait"
        ? image.size.width_in / image.size.height_in
        : image.size.height_in / image.size.width_in;
    setRatioValue(newRatioValue);
    debounceUpdateCroppedPhoto();
  };

  const handleImageLoad = () => {
    const cropper = cropperRef.current;
    if (cropper && cropper.isLoaded()) {
      const imageSize = cropper.getVisibleArea();

      if (imageSize) {
        const fullWidth = imageSize.width;
        const fullHeight = fullWidth / ratioValue;

        let top = 0;
        let height = fullHeight;

        if (fullHeight > imageSize.height) {
          height = imageSize.height;
          top = 0;
          const adjustedWidth = height * ratioValue;
          const left = (imageSize.width - adjustedWidth) / 2;

          cropper.setCoordinates({
            width: adjustedWidth,
            height: height,
            left,
            top,
          });
        } else {
          const left = 0;
          top = (imageSize.height - fullHeight) / 2;

          cropper.setCoordinates({
            width: fullWidth,
            height: fullHeight,
            left,
            top,
          });
        }
      }
    }

    setTimeout(() => {
      handleLoadCroppedImage();
    }, 100);
  };

  const handleLoadCroppedImage = () => {
    const canvas = cropperRef.current.getCanvas();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/jpeg");
    const file = dataURLToFile(dataUrl, `cropped-${Date.now()}.jpg`);

    updateCroppedFiles(image.preview, file);
  };

  useEffect(() => {
    refreshRatio();
  }, [image, orientation]);

  return (
    <div className="mini-cropper-wrapped">
      <Cropper
        src={src}
        ref={cropperRef}
        sizeRestrictions={ImageRestriction.fitArea}
        stencilProps={{
          aspectRatio: ratioValue,
          movable: true,
          grid: true,
          resizable: true,
          lines: true,
          handlers: true,
        }}
        onUpdate={onUpdate}
        onReady={handleImageLoad}
      />
    </div>
  );
};

export default MiniCropper;
