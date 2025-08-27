import React from "react";
import { PhotoIDProvider } from "../providers/PhotoIDProvider";
import PhotoIDScreen from "../components/screens/PhotoIDScreen";

const PhotoID = () => {
  return (
    <PhotoIDProvider>
      <PhotoIDScreen />
    </PhotoIDProvider>
  );
};

export default PhotoID;
