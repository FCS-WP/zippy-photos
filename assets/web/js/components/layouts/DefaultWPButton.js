import { Box, Button } from "@mui/material";
import React, { useState } from "react";

const DefaultWPButton = () => {
  const [quantity, setQuantity] = useState(1);

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
        className="single_add_to_cart_button button alt"
        variant="contained"
        sx={{ borderRadius: 0, color: "#fff", px: 4 }}
        color="secondary"
        type="submit"
      >
        Add To Cart
      </Button>
    </Box>
  );
};

export default DefaultWPButton;
