import React, { ReactNode } from "react";
import {
  IconButton,
  Typography,
  useTheme,
  Icon,
  useMediaQuery,
  Theme,
  Grid,
  Paper,
} from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppDrawerContext } from "../contexts";
import Speed from "../../shared/assets/img/Speed.png";
import deicmar from "../../shared/assets/img/deicmar.png"


interface ILayoutBaseDePaginaProps {
  children: ReactNode;
  titulo: string;
  barraDeFerramentas?: ReactNode;
}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({
  children,
  titulo,
  barraDeFerramentas,
}) => {
  // Media queries to determine screen size
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const theme = useTheme();

  // Accessing the app drawer context
  const { toggleDrawerOpen } = useAppDrawerContext();

  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      gap={1}
      sx={{
        "& > div": {
          "&::-webkit-scrollbar": { height: 10, WebkitAppearance: "none" },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            border: "2px solid",
            borderColor:
              theme.palette.mode === "dark" ? "" : "#E7EBF0",
            backgroundColor: "rgba(0 0 0 / 0.2)",
          },
          // Adicione esta parte para aplicar o gradiente invertido nos boxes
          background:
            theme.palette.mode !== "dark"
              ? "linear-gradient(to left, #DDE2E5, #FDFBFB 70%)"
              : "linear-gradient(to left, #282828, #434343 70%)",
          color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
        },
      }}
    >



<Box
  padding={1}
  display="flex"
  alignItems="center"
  gap={1}
  height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)}
  component={Paper}
  elevation={24}
>
  {smDown && (
    <IconButton color="primary" onClick={toggleDrawerOpen}>
      <MenuIcon />
    </IconButton>
  )}
  <div style={{ flexGrow: 1 }}>
    <Typography
      variant={smDown ? 'h6' : mdDown ? 'h6' : 'h3'}
      style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
    >
      {titulo}
    </Typography>
  </div>
  <Grid container alignItems="center" justifyContent="flex-end">
    <img
      src={deicmar}
      style={{ width: smDown ? '50px' : '100px', height: 'auto' }}
      alt=""
    />
  </Grid>
</Box>




      {barraDeFerramentas && <Box>{barraDeFerramentas}</Box>}
      <Box flex={1} overflow="auto"   sx={{
    color: theme.palette.text.secondary,
    backgroundImage: `linear-gradient(to right, ${
      theme.palette.mode === "dark" ? "#434343" : "#FDFBFB"
    }, ${theme.palette.mode === "dark" ? "#282828" : "#EBEDEE"})`,
  }}>
        {" "}
        {/* Creating a scrollable container */}
        {children} {/* Rendering the child components */}
      </Box>
      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        component={Paper}
        elevation={24}
      >
        <Grid item>
          <img src={Speed} style={{ width: "200px", height: "100%" }} alt="" />{" "}
          {/* Displaying an image */}
        </Grid>
      </Grid>
    </Box>
  );
};
