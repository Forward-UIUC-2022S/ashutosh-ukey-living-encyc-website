import { createTheme } from "@material-ui/core/styles";

// A custom theme for this app
const theme = createTheme({
  typography: {
    // fontSize: 12
  },
  palette: {
    primary: {
      main: "#E3A2A2",
      highlight: "#d67676",
    },
    secondary: {
      main: "#70B1C8",
    },
    inputGray: {
      light: "#EDEDED",
      main: "#E4E4E4",
    },
    backGray: {
      main: "#D8D8D8",
      dark: "#999999",
    },
    pendingYellow: {
      main: "#DFC19F",
    },
    warning: {
      main: "#DFC19F",
    },
    verifyGreen: {
      main: "#9CCCB8",
    },
    verifyRed: {
      main: "#E3A2A2",
    },
    tonalOffset: 0.2,
  },
});

export default theme;

export const defaultSubColors = ["light", "contrastText"];
