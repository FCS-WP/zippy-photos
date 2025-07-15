import { Box, Button, Input } from "@mui/material";
import React, { useState } from "react";
import { usePhotobookProvider } from "../../providers/PhotobookProvider";
import axios from "axios";
import { showAlert } from "../../helpers/showAlert";

const PhotobookAddToCart = () => {
  const [quantity, setQuantity] = useState(1);
  const { isATCDisabled, uploadedImages } = usePhotobookProvider();

  const handleSubmitAddtoCart = async (e) => {
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

    uploadedImages.forEach((item, index) => {
      formData.append(`files[${index}][file]`, item.file);
    });

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
      window.location.href = response.data.product_url;
    } else {
      showAlert(
        "error",
        "FAILED",
        "Oops! Something went wrong. Please try again later."
      );
    }
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
        color="secondary"
        type="button"
      >
        Add To Cart
      </Button>
    </Box>
  );
};

export default PhotobookAddToCart;
