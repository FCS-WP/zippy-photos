import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { SearchContainer, StyledPaper } from "../mui-custom-styles";
import { BsFillQuestionCircleFill, BsSearch } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { AlertStatus, showAlert } from "../../utils/alertHelper";
import MenuContext from "../../contexts/MenuContext";
import { Api } from "../../api";
import theme from "../../../theme/theme";
import StoreIcon from "@mui/icons-material/Store";
import PlaceIcon from "@mui/icons-material/Place";

const AddNewMenu = () => {
  const { refetchMenus } = useContext(MenuContext);
  const [isLoading, setIsLoading] = useState(false);
  const [outletName, setOuletName] = useState("");
  const [outletAddress, setOutletAddress] = useState("");

  const handleAddMenus = async () => {
    if (!outletName || !outletAddress) {
      showAlert(
        AlertStatus.error,
        "Failed!",
        "Outlet name or address is invalid"
      );
    } else {
      const newItem = {
        name: outletName,
        address: outletAddress,
      };
      const { data: res } = await Api.createMenu(newItem);
      if (!res || res.success !== true) {
        showAlert(
          AlertStatus.error,
          "Failed!",
          "Can not add menu. Please try again!"
        );
        return;
      }
      refetchMenus();
      setOuletName("");
      setOutletAddress("");
      showAlert(
        AlertStatus.success,
        "Successfully!",
        `Menu "${outletName}" had been added`
      );
    }
  };

  const tooltipAddCategories = `Add new menu.`;

  return (
    <Grid container alignItems={'center'} spacing={3}>
      <Grid size={12}>
        <StyledPaper>
          <Grid container alignItems={"center"} spacing={2}>
            <Grid size={{ xs: 12, md: 10 }}>
              <SearchContainer>
                <Grid container alignItems={'center'} spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Outlet name"
                      variant="outlined"
                      placeholder="Enter oulet name..."
                      value={outletName}
                      onChange={(e) => setOuletName(e.target.value)}
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
              </SearchContainer>
            </Grid>
            <Grid
              display={"flex"}
              justifyContent={"end"}
              size={{ xs: 12, md: 2 }}
              textAlign={"end"}
              alignItems={"center"}
              gap={1}
            >
              <Button
                className="btn-hover-float"
                sx={{ fontSize: "12px" }}
                onClick={handleAddMenus}
                variant="contained"
                disabled={isLoading}
                startIcon={<FiPlus />}
              >
                Create Outlet
              </Button>
              <Tooltip sx={{}} title={tooltipAddCategories}>
                <IconButton size="small" sx={{ p: 0, mb: 0.5 }}>
                  <BsFillQuestionCircleFill
                    color={theme.palette.primary.main}
                    role="button"
                  />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default AddNewMenu;
