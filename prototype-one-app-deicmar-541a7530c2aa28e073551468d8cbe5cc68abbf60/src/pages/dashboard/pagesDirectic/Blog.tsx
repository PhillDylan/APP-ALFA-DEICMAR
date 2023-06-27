import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LayoutBaseDePagina } from "../../../shared/layouts";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StartIcon from '@mui/icons-material/Start';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';

import FeaturedPost from "./FeaturedPost";

// Obtém a data atual
const currentDate = new Date();
const month = currentDate.toLocaleString("default", { month: "short" });
const day = currentDate.getDate();

// Array de posts em destaque
const featuredPosts = [
  {
    title: "GATE ENTRADA",
    date: `${month} ${day}`,
    description: "",
    path: "/agendamento2",
    image: "",
    imageLabel: "",
    gate: 'IN',
    icon: <KeyboardTabIcon sx={{ width: '100%', height: '100%', transform: 'rotate(180deg)' }} />,
  },
  // ...
  {
    title: 'GATE SAIDA',
    date: `${month} ${day}`,
    description: '',
    path: '/agendamento2',
    gate:'OUT',
    icon: <StartIcon sx={{ width: '100%', height: '100%' }} />,
  },
];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export const Blog = () => {
  return (
    <LayoutBaseDePagina titulo="TIPO DE GATE">
      <Container maxWidth="lg">
        <main>
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} sx={{ mt: 3 }}></Grid>
        </main>
      </Container>
    </LayoutBaseDePagina>
  );
};
