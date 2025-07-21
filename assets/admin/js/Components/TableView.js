import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  FormControlLabel,
  Button,
  Box,
  Grid,
  Collapse,
  IconButton,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTableRow from "./Table/CustomTableRow";
import theme from "../../theme/theme";

const TableView = (props) => {
  const {
    hideCheckbox = false,
    cols,
    rows,
    columnWidths = {},
    canBeDeleted = false,
    onDeleteRows = () => {},
    showBookingFilter = false,
    onChangeList = () => {},
    headerElement,
  } = props;
  const [selectedRows, setSelectedRows] = useState({});

  useEffect(() => {
    const initialSelection = rows.reduce((acc, _, index) => {
      acc[index] = false;
      return acc;
    }, {});
    setSelectedRows(initialSelection);
  }, [rows]);

  const handleRowCheckboxChange = (rowIndex) => {
    setSelectedRows((prevState) => ({
      ...prevState,
      [rowIndex]: !prevState[rowIndex],
    }));
  };

  const handleMasterCheckboxChange = (event) => {
    const newSelection = rows.reduce((acc, _, index) => {
      acc[index] = event.target.checked;
      return acc;
    }, []);
    setSelectedRows(newSelection);
  };

  const isMasterChecked =
    rows.length > 0 && Object.values(selectedRows).every(Boolean);

  const isMasterIndeterminate =
    !isMasterChecked && Object.values(selectedRows).some((checked) => checked);

  const renderDeleteButton = () => {
    return (
      <Box textAlign={"end"}>
        <IconButton
          disabled={!isMasterChecked && !isMasterIndeterminate ? true : false}
          aria-label="delete"
          size="small"
          color="error"
          sx={{ fontSize: "12px" }}
          onClick={() => onDeleteRows(selectedRows)}
        >
          <DeleteIcon sx={{ fontSize: "20px" }} />
        </IconButton>
      </Box>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Grid container mb={2}>
        <Grid size={11}>{headerElement ?? ""}</Grid>
        <Grid size={1}>
          {canBeDeleted ? renderDeleteButton() : ""}
        </Grid>
      </Grid>
      <Box
        sx={{
          border: "1px solid",
          borderBottom: "none",
          borderColor: theme.palette.info.main,
          boxSizing: "border-box",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.info.main }}>
            <TableRow sx={{ borderColor: theme.palette.primary.main }}>
              {!hideCheckbox && (
                <TableCell
                  padding="checkbox"
                  style={{ width: "50px", textAlign: "center" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isMasterChecked}
                        indeterminate={isMasterIndeterminate}
                        onChange={handleMasterCheckboxChange}
                        sx={{ textAlign: "center" }}
                      />
                    }
                    style={{ marginRight: 0 }}
                  />
                </TableCell>
              )}
              {cols &&
                cols.map((col, index) => (
                  <TableCell
                    key={index}
                    style={{
                      width: columnWidths[col] || "auto",
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#fff" }}>
            {rows.map((row, rowIndex) => (
              <CustomTableRow
                hideCheckbox={hideCheckbox}
                key={rowIndex}
                row={row}
                cols={cols}
                columnWidths={columnWidths}
                selectedRows={selectedRows}
                rowIndex={rowIndex}
                onChangeList={onChangeList}
                onChangeCheckbox={handleRowCheckboxChange}
              />
            ))}
          </TableBody>
        </Table>
      </Box>
    </TableContainer>
  );
};

export default TableView;
