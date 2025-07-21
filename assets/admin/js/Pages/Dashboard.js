import React, { useEffect, useState } from "react";
import { StyledPaper } from "../Components/mui-custom-styles";
import {
  Box,
  Button,
  Grid,
  Input,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import { Api } from "../api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [rootFolderId, setRootFolderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHasToken, setIsHasToken] = useState(false);

  const getAdminConfig = async () => {
    setIsLoading(true);
    const { data: response } = await Api.getAdminConfig();
    if (response.status == "success" && response.result) {
      setRootFolderId(response.result.folder_id);
      setIsHasToken(response.result.is_has_token);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAdminConfig();
    return () => {};
  }, []);

  const handleConnectGoogleAPI = async () => {
    const url = window.location.pathname + "?get-photobook-token=1";
    window.open(url, '_blank');
  };

  const handleUpdateFolderId = async () => {
    const params = {
      folder_id: rootFolderId,
    };
    const callUpdate = await Api.updateRootFolder(params);
    if (!callUpdate || callUpdate.error) {
      toast.error('Can not update Folder ID!')
    }
  };

  return (
    <StyledPaper>
      <Box className="custom-mui">
        <Typography variant="h6" mb={3}>
          Photobook Settings
        </Typography>
        <Grid container spacing={2} alignItems={"center"}>
          <Grid size={{ xs: 9, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Root folder id"
              variant="outlined"
              placeholder="Enter folder id..."
              value={rootFolderId}
              onChange={(e) => setRootFolderId(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FolderSharedIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 3, md: 2 }}>
            <Button
              sx={{ borderRadius: "3px" }}
              variant="contained"
              color="secondary"
              onClick={handleUpdateFolderId}
              loading={isLoading}
            >
              Update
            </Button>
          </Grid>
        </Grid>
        <Typography variant="h6" mt={3} mb={1} >
            { !isHasToken ? 'Connect to use photobook feature.' : 'Token already exist!' }
        </Typography> 
        <Button
          sx={{ borderRadius: "3px" }}
          variant="contained"
          color="primary"
          loading={isLoading}
          onClick={handleConnectGoogleAPI}
        >
          Connect with google API
        </Button>
      </Box>
    </StyledPaper>
  );
};

export default Dashboard;
