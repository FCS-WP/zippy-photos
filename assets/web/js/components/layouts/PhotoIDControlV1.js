import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { StyledPaper } from "../mui-custom";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";

const PhotoIDControlV1 = () => {
  const { products, updateState } = usePhotoIDProvider();
  const [photoPrice, setPhotoPrice] = useState({
    regular: null,
    sale: null,
  });


  const [dataProduct, setDataProduct] = useState({
    product: products[0] ?? null,
    edit_bg: "No",
    type: "Passport",
  });

  const renderPrice = (value) => {
    return (
      <>
        {value.sale ? (
          // show sale price
          <>
            <Box display={"flex"} gap={1} alignItems={'center'}>
              <Typography
                mb={2}
                fontSize={16}
                sx={{ textDecoration: "line-through" }}
                color="primary"
                fontWeight={500}
              >
                ${value.regular ? value.regular.toFixed(2) : 0}
              </Typography>
              <Typography
                mb={2}
                fontSize={24}
                color="secondary"
                fontWeight={500}
              >
                ${value.sale ? value.sale.toFixed(2) : 0}
              </Typography>
            </Box>
          </>
        ) : (
          // show regular price
          <Typography mb={2} fontSize={24} color="secondary" fontWeight={500}>
            ${value.regular ? value.regular.toFixed(2) : 0}
          </Typography>
        )}
      </>
    );
  };

  const updatePhotoPrice = (updates) =>
    setPhotoPrice((prev) => ({ ...prev, ...updates }));

  const updateDataProduct = (updates) =>
    setDataProduct((prev) => ({ ...prev, ...updates }));

  const handlePrices = () => {
    if (!products) {
      updatePhotoPrice({
        regular: 0,
        sale: null,
      });
      return;
    }

    if (!dataProduct.product.variations) {
      updatePhotoPrice({
        regular: parseFloat(dataProduct.product?.price),
        sale: parseFloat(dataProduct.product?.sale),
      });
      return;
    }

    const variations = dataProduct.product.variations;
    const selectedVariation = variations.find((item) => {
      let condition1 =
        item.attrs["document-type"].toLowerCase() ===
        dataProduct.type.toLowerCase();
      let condition2 =
        item.attrs["edit-background"].toLowerCase() ===
        dataProduct.edit_bg.toLowerCase();
      return condition1 && condition2;
    });
    if (selectedVariation) {
      updatePhotoPrice({
        regular: parseFloat(selectedVariation.regular),
        sale: parseFloat(selectedVariation.sale),
      });
      updateState({selectedVariation: selectedVariation})
    }

    return;
  };

  useEffect(() => {
    updateState({selectedProduct: dataProduct})
    handlePrices();
  }, [dataProduct]);

  return (
    <StyledPaper>
      {/* Box Price */}
      <Box>
        <Typography mb={2} fontSize={18} fontWeight={500}>
          Price
        </Typography>
        {renderPrice(photoPrice)}
      </Box>

      {/* Box Document Type */}
      <Box>
        <Typography mb={2} fontSize={18} fontWeight={500}>
          Document Type
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            id="document-type"
            size="small"
            variant="outlined"
            value={dataProduct.type}
            sx={{ p: "6px" }}
            onChange={(e) => updateDataProduct({ type: e.target.value })}
          >
            <MenuItem value={"Passport"}>Passport</MenuItem>
            <MenuItem value={"Visa"}>Visa</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Box Product Type */}
      <Box>
        <Typography mb={2} fontSize={18} fontWeight={500}>
          Select Product Type
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            id="product-type"
            size="small"
            variant="outlined"
            value={dataProduct.product}
            sx={{ p: "6px" }}
            onChange={(e) => updateDataProduct({ product: e.target.value })}
          >
            {products.map((products) => (
              <MenuItem key={products.id} value={products}>
                {products.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Box Edit BG */}
      <Box>
        <Typography mb={2} fontSize={18} fontWeight={500}>
          Edit Background?
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            id="edit-bg"
            size="small"
            variant="outlined"
            value={dataProduct.edit_bg}
            sx={{ p: "6px" }}
            onChange={(e) => updateDataProduct({ edit_bg: e.target.value })}
          >
            <MenuItem value={"No"}>No</MenuItem>
            <MenuItem value={"Yes"}>Yes</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </StyledPaper>
  );
};

export default PhotoIDControlV1;
