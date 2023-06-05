import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles'; // Importe o useTheme
import Cookies from 'js-cookie';

interface FeaturedPostProps {
  post: {
    date: string;
    description: string;
    title: string;
    path: string; // Adicione a propriedade path ao post
    gate: string;
    icon: React.ReactNode; // Adicione a propriedade icon ao post
  };
}

export default function FeaturedPost(props: FeaturedPostProps) {
  const { post } = props;
  const navigate = useNavigate(); // Importe o useNavigate
  const theme = useTheme(); // Obtenha o tema atual
  const COOKIE_KEY__GATE = 'APP_GATE';

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Impede o comportamento padrão do link
    navigate(post.path); // Navegue para a rota definida em post.path
    Cookies.set(COOKIE_KEY__GATE, post.gate );

  };


  return (
    <Grid item xs={12} md={12} lg={24} xl={48}>
      <CardActionArea component="a" href="" onClick={handleClick}>
        <Card  sx={{
            display: 'flex',
            backgroundColor: theme.palette.background.paper,
            // Adicione esta parte para aplicar o gradiente invertido
            background:
              theme.palette.mode !== 'dark'
                ? 'linear-gradient(to right, #DDE2E5, #FDFBFB)'
                : 'linear-gradient(to right, #282828, #434343)',
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
          }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {post.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {post.date}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {post.description}
            </Typography>
            <Typography variant="subtitle1" color="primary">
              AVANÇAR
            </Typography>
          </CardContent>
          <CardMedia sx={{ width: 160 }}>
            {post.icon}
          </CardMedia>
        </Card>
      </CardActionArea>
    </Grid>
  );
}