import { Box, Button, Grid, InputAdornment, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import { StyledPaper } from "../mui-custom-styles";
import StoreIcon from "@mui/icons-material/Store";
import PlaceIcon from "@mui/icons-material/Place";
import { Api } from "../../api";
import { toast } from "react-toastify";
import MenuContext from "../../contexts/MenuContext";

const BoxUpdateMenuInfo = ({ menu }) => {
  const { refetchMenus } = useContext(MenuContext);
  const [outletName, setOutletName] = useState(menu.name || "");
  const [outletAddress, setOutletAddress] = useState(menu.address || "");

  const handleUpdateInfo = async () => {
    const newData = {
      id: menu.id,
      name: outletName,
      address: outletAddress,
    };
    const { data: response } = await Api.updateMenu(newData);
    console.log(response);

    if (!response || response.success !== true) {
      toast.error(response?.error?.message ?? "Update failed");
      return;
    }
    toast.success("Menu Updated!");
    refetchMenus();
  };

  return (
    <StyledPaper>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 10 }} container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Outlet name"
              variant="outlined"
              placeholder="Enter oulet name..."
              value={outletName}
              onChange={(e) => setOutletName(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <StoreIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Outlet address"
              variant="outlined"
              placeholder="Enter oulet address..."
              value={outletAddress}
              onChange={(e) => setOutletAddress(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlaceIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Box display={"flex"} justifyContent={"flex-end"}>
            <Button sx={{ px: 4 }} onClick={handleUpdateInfo} variant="contained">
              Update
            </Button>
          </Box>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default BoxUpdateMenuInfo;
