import React from "react";
import { linkMenuAdmin } from "../../../utils/bookingHelper";
import { NavLink } from "react-router";
import { Grid, Typography } from "@mui/material";

const DetailHeader = ({ menu }) => {
  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <NavLink style={{ fontSize: "13px" }} to={linkMenuAdmin}>
          Back to outlets
        </NavLink>
        <Typography fontWeight={600} variant="h5" my={2}>
          {menu.name}: {menu.address}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default DetailHeader;
