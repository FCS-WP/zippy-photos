import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#83D2BF", // Use 'main' key
    },
    secondary: {
      main: "#DB3F2E",
    },
    white: {
      main: "#FFF",
    },
    text: {
      primary: "#000",
      secondary: "#666",
    },
  },
});

export default theme;
