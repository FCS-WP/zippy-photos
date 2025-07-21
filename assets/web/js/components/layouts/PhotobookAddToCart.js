import { Box, Button, Input } from "@mui/material";
import React, { useState } from "react";
import { usePhotobookProvider } from "../../providers/PhotobookProvider";
import axios from "axios";
import { showAlert } from "../../helpers/showAlert";
import { webApi } from "../../api";

const PhotobookAddToCart = () => {
  const { isATCDisabled, uploadedImages } = usePhotobookProvider();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const get_isolate_imgs = () => {
    let step = 5;

    let result = [];
    let temp_array = [];
    let counter = 0;

    uploadedImages.map((item, index) => {
      temp_array.push(item);
      counter++;
      if (counter == step || index === uploadedImages.length - 1) {
        result.push(temp_array);
        temp_array = [];
        counter = 0;
      }
    });

    return result;
  };

  const handle_upload_files = async (folderId, cartItemKey) => {
    const isolatedImgs = get_isolate_imgs();

    if (!isolatedImgs || isolatedImgs.length == 0) {
      return false;
    }

    const postFilePromises = isolatedImgs.map((item, index) => {
      const isLastItem = index === isolatedImgs.length - 1;
      return save_to_drives(folderId, cartItemKey, item, isLastItem, index + 1);
    });

    try {
      const results = await Promise.all(postFilePromises);
      return true;
    } catch (err) {
      return false;
    }
  };

  const save_to_drives = async (
    folderId,
    cartItemKey,
    imgs,
    isLastItem = false,
    requestNo
  ) => {
    let productId = $('input[name="product_id"]').val();
    let formData = new FormData();
    formData.append("product_id", productId);
    formData.append("cart_item_key", cartItemKey);
    formData.append("last_photos", isLastItem);
    formData.append("folder_id", folderId);
    formData.append("request_no", requestNo);
    imgs.forEach((item, index) => {
      formData.append(`files[${index}][file]`, item.file);
    });

    const { data: response } = await webApi.savePhotobookPhotos(formData);
    return true;
  };

  const handleSubmitAddtoCart = async (e) => {
    setIsLoading(true);
    let variationId = $('input[name="variation_id"]').val();
    let productId = $('input[name="product_id"]').val();

    let formData = new FormData();
    formData.append("action", "add_to_cart_photobook");
    formData.append("product_id", productId);
    formData.append("variation_id", variationId);
    formData.append("quantity", quantity);

    $('select[name^="attribute_"], input[name^="attribute_"]').each(
      function () {
        let name = $(this).attr("name");
        let value = $(this).val();
        formData.append(name, value);
      }
    );

    formData.append("action", "photobook");
    formData.append("force_new_item", "yes");

    let domain = window.location.origin;
    const { data: response } = await axios.post(
      domain + "/wp-admin/admin-ajax.php",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.success && response.data) {
      const handle_upload_photobook = await handle_upload_files(
        response.data.folder.folder_id,
        response.data.cart_item_key
      );
      if (handle_upload_photobook) {
        window.location.reload();
      } else {
        setIsLoading(false);
        showAlert(
          "error",
          "FAILED",
          "Oops! Something went wrong. Please try again later."
        );
      }
    } else {
      setIsLoading(false);
      showAlert(
        "error",
        "FAILED",
        "Oops! Something went wrong. Please try again later."
      );
    }
    setIsLoading(false);
  };

  return (
    <Box display={"flex"} gap={2}>
      <Box width={"100px"}>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min={1}
          style={{ marginBottom: 0, textAlign: "center" }}
          name="quantity"
        />
      </Box>
      <Button
        variant="contained"
        sx={{ borderRadius: 0, color: "#fff", px: 4 }}
        disabled={isATCDisabled}
        onClick={handleSubmitAddtoCart}
        loading={isLoading}
        color="secondary"
        type="button"
      >
        Add To Cart
      </Button>
    </Box>
  );
};

export default PhotobookAddToCart;
