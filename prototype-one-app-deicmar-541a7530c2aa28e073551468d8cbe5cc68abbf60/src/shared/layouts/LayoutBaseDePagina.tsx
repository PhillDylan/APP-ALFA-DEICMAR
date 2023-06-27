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
import ipms from "../../shared/assets/img/ipms.png"
import ipms2 from "../../shared/assets/img/ipms2.png"
import bandeirantesDeicmar from "../../shared/assets/img/bandeirantesDeicmar.png"

// Propriedades do componente LayoutBaseDePagina
interface ILayoutBaseDePaginaProps {
  children: ReactNode; // Conteúdo renderizado dentro do componente
  titulo: string; // Título exibido no cabeçalho
  barraDeFerramentas?: ReactNode; // Componente de barra de ferramentas opcional
}

// Componente LayoutBaseDePagina
export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({
  children,
  titulo,
  barraDeFerramentas,
}) => {
  // Media queries para determinar o tamanho da tela
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const theme = useTheme();

  // Acessando o contexto do drawer do aplicativo
  const { toggleDrawerOpen } = useAppDrawerContext();

  return (
    <Box
      height="100%" // Altura ocupando 100% da tela
      display="flex" // Exibir os elementos em uma linha
      flexDirection="column" // Alinhar os elementos verticalmente
      gap={1} // Espaçamento entre os elementos
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
          // Aplicar um gradiente de fundo nos elementos
          background:
            theme.palette.mode !== "dark"
              ? "linear-gradient(to left, #DDE2E5, #FDFBFB 70%)"
              : "linear-gradient(to left, #282828, #434343 70%)",
          color: theme.palette.mode === "dark" ? "#FFFFFF" : "inherit",
        },
      }}
    >

<Box
  padding={1} // Espaçamento interno
  display="flex" // Exibir os elementos em uma linha
  alignItems="center" // Alinhar os elementos verticalmente
  gap={1} // Espaçamento entre os elementos
  height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)} // Altura do elemento baseada no tamanho da tela
  component={Paper} // Componente de papel para criar uma área retangular
  elevation={24} // Elevação do componente
>
  {smDown && (
    <IconButton color="primary" onClick={toggleDrawerOpen}>
      <MenuIcon /> {/* Ícone do menu */}
    </IconButton>
  )}
  <div style={{ flexGrow: 1 }}>
    <Typography
      variant={smDown ? 'h6' : mdDown ? 'h6' : 'h3'} // Variação do texto com base no tamanho da tela
      style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} // Estilo do texto
    >
      {titulo} {/* Título do cabeçalho */}
    </Typography>
  </div>
  <Grid container alignItems="center" justifyContent="flex-end">
    {theme.palette.mode === 'dark' ? (
      <img src={ipms2} style={{ width: smDown ? '40px' : '80px', height: 'auto' }} alt="" />
      ) : (
      <img src={ipms} style={{ width: smDown ? '40px' : '80px', height: 'auto' }} alt="" />
    )}
  </Grid>
</Box>

      {barraDeFerramentas && <Box>{barraDeFerramentas}</Box>} {/* Renderizar a barra de ferramentas, se existir */}
      <Box flex={1} overflow="auto"   sx={{
    color: theme.palette.text.secondary,
    backgroundImage: `linear-gradient(to right, ${
      theme.palette.mode === "dark" ? "#434343" : "#FDFBFB"
    }, ${theme.palette.mode === "dark" ? "#282828" : "#EBEDEE"})`,
  }}>
        {" "}
        {/* Criando um contêiner com rolagem */}
        {children} {/* Renderizando os componentes filhos */}
      </Box>
      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        component={Paper} // Componente de papel para criar uma área retangular
        elevation={24} // Elevação do componente
      >
        <Grid item>
          <img src={bandeirantesDeicmar} style={{ width: "200px", height: "100%" }} alt="" />{" "}
          {/* Exibindo uma imagem */}
        </Grid>
      </Grid>
    </Box>
  );
};
