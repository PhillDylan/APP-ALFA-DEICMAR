import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  useTheme,
  ListItemText,
  Icon,
  useMediaQuery,
  Typography,
  Grid,
} from "@mui/material";
import React from "react";
import { Box } from "@mui/system";
import { green } from "@mui/material/colors";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Avatar from "@mui/material/Avatar";
import { useAppDrawerContext, useAppThemeContext, useAuthContext } from "../../contexts";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import Cookies from 'js-cookie';
import { styled } from '@mui/system';
import ipms from "../../../shared/assets/img/ipms.png"
import ipms2 from "../../../shared/assets/img/ipms2.png"

// Estilização personalizada para o Drawer
const DrawerWithGradient = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    ...(theme.palette.mode !== 'dark' && {
      background: 'linear-gradient(to left, #DDE2E5, #FDFBFB 90%)',
    }),
    ...(theme.palette.mode === 'dark' && {
      background: 'linear-gradient(to left, #282828, #434343 90%)',
    }),
  },
}));

// Propriedades para um item de link do ListItem
interface IListItemLinkProps {
  to: string;
  icon: string;
  label: string;
  onClick: (() => void) | undefined;
}

// Componente para um item de link do ListItem
const ListItemLink: React.FC<IListItemLinkProps> = ({
  to,
  icon,
  label,
  onClick,
}) => {
  const navigate = useNavigate();

  const resolvedPath = useResolvedPath(to);

  const match = useMatch({ path: resolvedPath.pathname, end: false });

  const handleClick = () => {
    navigate(to);
    onClick?.();
  };

  return (
    <ListItemButton selected={!!match} onClick={handleClick}>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

interface IMenuLateral {
  children: React.ReactNode;
}

export const MenuLateral: React.FC<IMenuLateral> = ({ children }) => {

  // Chaves dos cookies
  const COOKIE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';
  const COOKIE_KEY__ID_OPERADOR = 'APP_ID_OPERADOR';
  const COOKIE_KEY__MESSAGE = 'APP_MESSAGE';
  const COOKIE_KEY__NOME_OPERADOR = 'APP_NOME_OPERADOR';
  const COOKIE_KEY__GATE = 'APP_GATE';
  const COOKIE_KEY__FIRST_ACCESS = 'APP_FIRST_ACCESS';

  // Lendo os valores dos cookies
  const accessToken = Cookies.get(COOKIE_KEY__ACCESS_TOKEN);
  const idOperador = Cookies.get(COOKIE_KEY__ID_OPERADOR);
  const message = Cookies.get(COOKIE_KEY__MESSAGE);
  const nomeOperador = Cookies.get(COOKIE_KEY__NOME_OPERADOR);
  const firstAccess = Cookies.get(COOKIE_KEY__FIRST_ACCESS);

  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));

  const { isDrawerOpen, toggleDrawerOpen, drawerOptions } =
    useAppDrawerContext();
  const { toggleTheme } = useAppThemeContext();
  const { logout } = useAuthContext();

  return (
    <>
      {/* Drawer com gradiente */}
      <DrawerWithGradient
        open={isDrawerOpen}
        variant={smDown ? "temporary" : "permanent"}
        onClose={toggleDrawerOpen}
      >
        <Box
          width={theme.spacing(28)}
          height="100%"
          display="flex"
          flexDirection="column"
        >
          <Box
            width="100%"
            height={theme.spacing(28)}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {/* Verifica o tema atual para exibir a imagem correta */}
            {theme.palette.mode === 'dark' ? (
              <img src={ipms2} style={{ width: theme.spacing(18), height: theme.spacing(18) }} alt="" />
            ) : (
              <img src={ipms} style={{ width: theme.spacing(18), height: theme.spacing(18) }} alt="" />
            )}
          </Box>

          <Divider />

          <Box display="flex" justifyContent="center">
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Typography style={{ padding: '16px' }}>Usuario: {nomeOperador}</Typography>
              </Grid>
              <Grid item>
                <Divider orientation="vertical" flexItem />
              </Grid>
              <Grid item>
                <Typography style={{ padding: '16px' }}>ID: {idOperador}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box flex={1}>
            <nav aria-label="main mailbox folders">
              <List>
                {/* Mapeia as opções do drawer */}
                {drawerOptions.map((drawerOption) => (
                  <ListItemLink
                    key={drawerOption.path}
                    icon={drawerOption.icon}
                    to={drawerOption.path}
                    label={drawerOption.label}
                    onClick={smDown ? toggleDrawerOpen : undefined}
                  />
                ))}
              </List>
            </nav>
          </Box>
          <Box>
            <nav aria-label="main mailbox folders">
              <List>
                {/* Botão para alternar o tema */}
                <ListItemButton onClick={toggleTheme}>
                  <ListItemIcon>
                    <Icon>dark_mode</Icon>
                  </ListItemIcon>
                  <ListItemText primary="Alternar tema" />
                </ListItemButton>
                {/* Botão para fazer logout */}
                <ListItemButton onClick={logout}>
                  <ListItemIcon>
                    <Icon>logout</Icon>
                  </ListItemIcon>
                  <ListItemText primary="Sair" />
                </ListItemButton>
              </List>
            </nav>
          </Box>
        </Box>
      </DrawerWithGradient>

      <Box height="100vh" marginLeft={smDown ? 0 : theme.spacing(28)}>
        {children}
      </Box>
    </>
  );
};
