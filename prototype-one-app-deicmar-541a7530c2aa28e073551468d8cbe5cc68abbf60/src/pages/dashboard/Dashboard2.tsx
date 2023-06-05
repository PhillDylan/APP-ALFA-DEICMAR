import { LayoutBaseDePagina } from "../../shared/layouts";
import { PhotoCamera } from "@mui/icons-material";
import { Enviroment } from "../../shared/environment";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import store, { RootState } from "./store";
import { Link } from "react-router-dom";
import compressImage from "browser-image-compression";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  backgroundImage: `linear-gradient(to right, ${
    theme.palette.mode === "dark" ? "#434343" : "#FDFBFB"
  }, ${theme.palette.mode === "dark" ? "#282828" : "#EBEDEE"})`,
}));



const CardWithGradient = styled(Card)(({ theme }) => ({
  height: '100%',
  ...(theme.palette.mode !== 'dark' && {
    background: 'linear-gradient(to right, #EBEDEE, #FDFBFB 90%)',
  }),
  ...(theme.palette.mode === 'dark' && {
    background: 'linear-gradient(to right, #282828, #434343 90%)',
  }),
}));


export const Dashboard2 = () => {
  const [lacre, setLacre] = useState("");
  const [image, setImage] = useState<
    { url: string; width: number; height: number } | undefined
  >();
  const [imagemSelecionada, setImagemSelecionada] = useState<
    string | undefined
  >();
  const [imagemSelecionadaBase64, setImagemSelecionadaBase64] = useState<
    string | undefined
  >();
  const listaItens = useSelector((state: RootState) => state.listaItens); // Obter o estado da lista de itens do Redux
  const imageRef = useRef<HTMLImageElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getImage = () => {
      if (imagemSelecionada) {
        setImage({
          url: imagemSelecionada,
          width: imageRef.current?.naturalWidth || 0,
          height: imageRef.current?.naturalHeight || 0,
        });
      }
    };
    getImage();
  }, [imagemSelecionada]);

  const handleImagemSelecionada = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const imagem = event.target.files[0];
      setImagemSelecionada(URL.createObjectURL(imagem));
      const options = {
        maxSizeMB: 0.3,
        useWebWorker: true,
      };
      try {
        const img = new Image();
        img.src = URL.createObjectURL(imagem);
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          const targetWidth = 1600;
          const targetHeight = 800;
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          context?.drawImage(img, 0, 0, targetWidth, targetHeight);

          if (canvas.toBlob) {
            canvas.toBlob(async (blob) => {
              if (blob) {
                const file = new File([blob], imagem.name, {
                  type: imagem.type,
                  lastModified: imagem.lastModified,
                });
                const compressedImage = await compressImage(file, options);
                const compressedDataUrl = URL.createObjectURL(compressedImage);
                const reader = new FileReader();
                reader.onload = () => {
                  const base64String = reader.result as string;
                  setImagemSelecionada(base64String);
                  setImagemSelecionadaBase64(
                    base64String.substring(base64String.lastIndexOf(",") + 1)
                  );
                };
                reader.readAsDataURL(compressedImage);
              }
            });
          }
        };
      } catch (error) {
        console.log(error);
      }
    }
  };

  const adicionarItem = () => {
    // Restante do código...
    const novoItem = { lacre, imagem: imagemSelecionadaBase64 };
    dispatch({ type: "SET_LISTA_ITENS", payload: [...listaItens, novoItem] }); // Atualizar o estado do Redux com o novo item
    // Resetar o lacre e a imagem selecionada
    setLacre("");
    setImagemSelecionada(undefined);
    setImagemSelecionadaBase64(undefined);
    setImage(undefined);
  };

  const removerItem = (index: number) => {
    const novoItem = [...listaItens];
    novoItem.splice(index, 1);
    dispatch({ type: "SET_LISTA_ITENS", payload: novoItem }); // Atualizar o estado do Redux removendo o item
  };

  const theme = useTheme();

  return (
    <>
      <LayoutBaseDePagina titulo="Cadastro Lacre" barraDeFerramentas={<></>}>
        <Divider />
        <Box height="200vh" >
        <CardWithGradient variant="outlined">
          <Stack spacing={5}>
            <CardContent>
              <Item>
                <Grid item>
                  {image ? (
                    <img
                      src={image.url}
                      alt="Selected"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  ) : (
                    <>
                      <label htmlFor="file">
                        <LoadingButton
                          loading={false}
                          loadingPosition="start"
                          startIcon={<PhotoCamera />}
                          variant="contained"
                          aria-label="upload picture"
                          component="span"
                        >
                          ADICIONAR IMAGEM
                        </LoadingButton>
                        <input
                          onChange={handleImagemSelecionada}
                          id="file"
                          style={{ display: "none" }}
                          type="file"
                        />
                      </label>
                    </>
                  )}
                </Grid>
                <TextField
                    fullWidth
                    placeholder="AMOSTRA123456789"
                    error={lacre.length < 3}
                    required
                    id="outlined-required"
                    label={<Typography>OBRIGATORIO</Typography>}
                    value={lacre}
                    InputLabelProps={{ shrink: true }}
                    margin={"normal"}
                    onChange={(event) => {
                      setLacre(event.target.value.toUpperCase()); // Converter o texto para caixa alta
                    }}
                    helperText={<Typography>Digite o Lacre</Typography>}
                    inputProps={{
                      style: {
                        textAlign: "center", // Centralizar o texto
                        textTransform: "uppercase", // Converter o texto para caixa alta
                      },
                    }}
                  />
                <LoadingButton
                  loading={false}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  onClick={adicionarItem}
                  disabled={!lacre || !imagemSelecionada} // Desabilitar o botão quando não houver valor no lacre ou imagem selecionada
                >
                  SALVAR
                </LoadingButton>

                <List
                  sx={{
                    width: "100%",
                    maxHeight: 400,
                    overflow: "auto",
                    "& ul": {
                      padding: 0,
                      "&::-webkit-scrollbar": {
                        height: 10,
                        WebkitAppearance: "none",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        border: "2px solid",
                        borderColor:
                          theme.palette.mode === "dark" ? "" : "#E7EBF0",
                        backgroundColor: "rgba(0 0 0 / 0.5)",
                      },
                    },
                  }}
                  subheader={
                    <ListSubheader
                      disableSticky
                      component="div"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: theme.palette.background.paper,
                        height: 56,
                        pl: 2,
                      }}
                    >
                      <Typography variant="h6">Lista de Lacres</Typography>
                      <Box sx={{ flexGrow: 1 }} />
                    </ListSubheader>
                  }
                >
                  {listaItens.map((item, index) => (
                    <li key={`item-${index}`}>
                      <ListItem>
                        <ListItemText primary={item.lacre} />
                        <IconButton
                          color="secondary"
                          edge="end"
                          aria-label="delete"
                          onClick={() => removerItem(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    </li>
                  ))}
                </List>

                <Link to="/checklist">
                  <Button size="large" variant="contained">
                    VOLTAR
                  </Button>
                </Link>
              </Item>
            </CardContent>
          </Stack>
          </CardWithGradient>
        </Box>
      </LayoutBaseDePagina>
    </>
  );
};

export default Dashboard2;
