import React, { useEffect, useState } from "react";
import { Box, Divider } from "@mui/material";
import ProductList from "./ProductList";
import { Api } from "../../api";

const MenuProducts = ({ menu }) => {
  const [products, setProducts] = useState([]);

  const fetchMenuProducts = async () => {
    const { data: response } = await Api.getMenuProducts({ menu_id: menu.id });
    if (!response || response.success !== true) {
      console.warn("Products not found!");
      setProducts([]);
      return;
    }
    setProducts(response.results);
  };

  useEffect(() => {
    fetchMenuProducts();
    return () => {};
  }, []);

  return (
    <Box>
      {menu && (
        <>
          <Divider sx={{ my: 3 }} />
          <ProductList
            refetchProducts={fetchMenuProducts}
            products={products}
            menuId={menu.id}
          />
        </>
      )}
    </Box>
  );
};

export default MenuProducts;
