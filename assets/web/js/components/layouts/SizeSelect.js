import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useMainProvider } from "../../providers/MainProvider";

const SizeSelect = ({ onChange, image }) => {
  const [size, setSize] = useState(image.size);
  const { photoSizes } = useMainProvider();
  const onChangeSize = (e) => {
    onChange(e);
    setSize(e.target.value);
  }

  useEffect(()=>{
    setSize(image.size);
  }, [image])

  return (
    <FormControl fullWidth>
      <InputLabel sx={{ background: "#fff", px: 1 }} id="label-size">
        Photo Size
      </InputLabel>
      <Select
        labelId="label-size"
        id="size"
        size="small"
        variant="outlined"
        value={size}
        sx={{ p: "6px" }}
        onChange={onChangeSize}
      >
        {photoSizes.map((photoSize) => (
          <MenuItem key={photoSize.id} value={photoSize}>
            {photoSize.name + " . " + photoSize.price} 
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SizeSelect;
