import React, { useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Tooltip,
} from "@mui/material";
import { BsFillQuestionCircleFill, BsSearch } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import {
  ChipContainer,
  SearchContainer,
  SuggestionsContainer,
} from "../../mui-custom-styles";
import { debounce } from "../../../utils/searchHelper";
import { Api } from "../../../api";
import { toast } from "react-toastify";
import theme from "../../../../theme/theme";

const BoxAddCategories = ({ selectedMenu, refetchProducts }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryClick = (category) => {
    const isInSelectedArr = selectedCategories.find(
      (item) => item.id === category.id
    );
    if (!isInSelectedArr) {
      setSelectedCategories([...selectedCategories, category]);
    }
    setSearchQuery("");
  };

  const handleCategoryKeyDown = (event) => {
    if (event.key === "Enter" && filteredCategories.length > 0) {
      handleCategoryClick(filteredCategories[0]);
      event.preventDefault();
    }
  };

  const handleAddCategories = async () => {
    if (selectedCategories.length == 0) {
      return false;
    }

    const ids = selectedCategories.map((item) => {
      return item.id;
    });

    const params = {
      menu_id: selectedMenu,
      category_ids: ids,
    };

    const { data: response } = await Api.addProductsByCategories(params);

    if (!response || response.success !== true) {
      toast.error(response.message ?? "failed to add products");
      return;
    }

    toast.success(response.message);
    setSelectedCategories([]);
    refetchProducts();
  };

  const handleSearchCategories = async (keyword) => {
    try {
      const params = {
        keyword: keyword,
      };
      const { data } = await Api.searchCategories(params);
      return data.results;
    } catch (error) {
      console.error("Error when search");
    }
  };

  const debounceSearchProducts = useCallback(
    debounce(async (keyword) => {
      if (keyword.trim()) {
        const dataProducts = await handleSearchCategories(keyword);
        if (dataProducts) {
          setFilteredCategories(dataProducts);
        } else {
          toast.error("Search error");
          setFilteredCategories([]);
        }
      } else {
        setFilteredCategories([]);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debounceSearchProducts(searchQuery);
  }, [searchQuery]);

  return (
    <Box>
      <SearchContainer>
        <TextField
          fullWidth
          label="Search Products"
          variant="outlined"
          placeholder="Type to search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleCategoryKeyDown}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <BsSearch />
                </InputAdornment>
              ),
            },
          }}
        />
        {searchQuery && (
          <SuggestionsContainer>
            <List>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((product, index) => (
                  <ListItemButton
                    key={index}
                    divider={index !== filteredCategories.length - 1}
                    onClick={() => handleCategoryClick(product)}
                  >
                    <ListItemText primary={product.name} />
                  </ListItemButton>
                ))
              ) : (
                <ListItemButton>
                  <ListItemText
                    primary="No products found"
                    sx={{ color: "text.secondary" }}
                  />
                </ListItemButton>
              )}
            </List>
          </SuggestionsContainer>
        )}
      </SearchContainer>
      <Grid container mt={2} spacing={3} alignItems={"end"}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <ChipContainer>
            {selectedCategories.map((product, index) => (
              <Chip
                key={index}
                label={product.name}
                onDelete={() => handleDeleteProduct(product)}
              />
            ))}
          </ChipContainer>
        </Grid>
        <Grid
          display={"flex"}
          justifyContent={"end"}
          size={{ xs: 12, lg: 5 }}
          textAlign={"end"}
          alignItems={"center"}
          gap={1}
        >
          <Button
            className="btn-hover-float"
            disabled={isLoading}
            sx={{ fontSize: "12px" }}
            onClick={handleAddCategories}
            variant="contained"
            startIcon={<FiPlus />}
          >
            Add Products
          </Button>
          <Tooltip title="Add product to menu">
            <IconButton size="small" sx={{ p: 0, mb: 0.5 }}>
              <BsFillQuestionCircleFill
                color={theme.palette.primary.main}
                role="button"
              />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BoxAddCategories;
