import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { usePhotoIDProvider } from "../../../providers/PhotoIDProvider";
import { shallowEqual } from "../../../helpers/editorHelper";

const PhotoIDSelection = () => {
  const { productData, updateState } = usePhotoIDProvider();
  const [attrs, setAttrs] = useState(null);
  const [attrKeys, setAttrKeys] = useState([]);
  const [photoPrice, setPhotoPrice] = useState({
    regular: null,
    sale: null,
  });

  const [country, setCountry] = useState("");

  const [customerData, setCustomerData] = useState(null);

  const renderPrice = (value) => {
    return (
      <>
        {value.sale ? (
          <>
            <Box display={"flex"} gap={1} alignItems={"center"}>
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

  const handleMetaData = (e) => {
    setCountry(e.target.value);
    updateState({
      metadata: {
        country: e.target.value,
      },
    });
  };

  const handleDataAttrs = () => {
    if (!productData.variations || productData.variations.length < 1) {
      setAttrs(null);
      return;
    }
    let variationAttrs = [];

    productData.variations.map((variation) => {
      const attrKeys = Object.keys(variation.attrs);

      attrKeys.map((key) => {
        if (!variationAttrs[key]) {
          variationAttrs[key] = [];
        }
        if (!variationAttrs[key].includes(variation.attrs[key])) {
          variationAttrs[key] = [...variationAttrs[key], variation.attrs[key]];
        }
      });
    });

    let initCustomerData = [];

    const variationKeys = Object.keys(variationAttrs);
    setAttrKeys(variationKeys);

    variationKeys.forEach((item) => {
      initCustomerData[item] = variationAttrs[item][0];
    });

    setCustomerData(initCustomerData);
    setAttrs(variationAttrs);
  };

  const updatePhotoPrice = (updates) =>
    setPhotoPrice((prev) => ({ ...prev, ...updates }));

  const updateCustomerData = (updates) =>
    setCustomerData((prev) => ({ ...prev, ...updates }));

  const handlePrices = () => {
    if (!productData) {
      updatePhotoPrice({
        regular: 0,
        sale: null,
      });
      return;
    }

    if (!productData.variations) {
      updatePhotoPrice({
        regular: parseFloat(productData?.price),
        sale: parseFloat(productData?.sale),
      });
      return;
    }

    const variations = productData.variations;

    const selectedVariation = variations.find((item) => {
      return shallowEqual(customerData, item.attrs);
    });

    if (selectedVariation) {
      updatePhotoPrice({
        regular: parseFloat(selectedVariation.regular),
        sale: parseFloat(selectedVariation.sale),
      });
      updateState({ selectedVariation: selectedVariation });
    }

    return;
  };

  const showTitleSlug = (key) => {
    const removeDash = key.replace("-", " ");
    return removeDash.toUpperCase();
  };

  useEffect(() => {
    if (customerData) {
      handlePrices();
    }
  }, [customerData]);

  useEffect(() => {
    handleDataAttrs();
  }, []);

  return (
    <Box>
      {/* Box Price */}
      <Box>{renderPrice(photoPrice)}</Box>

      {/* Render Attributes Of Variation */}

      {attrKeys.length > 0 &&
        attrKeys.map((attrKey, index) => (
          <Box key={index}>
            <Typography mb={2} fontSize={14} fontWeight={500}>
              {showTitleSlug(attrKey)}
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select
                id={attrKey}
                size="small"
                variant="outlined"
                value={customerData[attrKey]}
                sx={{ p: 0 }}
                onChange={(e) =>
                  updateCustomerData({ [attrKey]: e.target.value })
                }
              >
                {attrs[attrKey].map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>

              {attrKey == "country" && customerData["country"] === "Others" && (
                <Box mt={1}>
                  <TextField
                    color="#333"
                    fontSize={14}
                    className="custom-input input-country"
                    size="small"
                    label="Enter Your Country (*)"
                    variant="standard"
                    onChange={handleMetaData}
                    value={country}
                  />
                </Box>
              )}
            </FormControl>
          </Box>
        ))}
    </Box>
  );
};

export default PhotoIDSelection;
