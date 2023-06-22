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
import { Link, useNavigate } from "react-router-dom";
import compressImage from "browser-image-compression";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import debounce from "lodash.debounce"; // Importe o debounce do pacote lodash.debounce



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


export const Update = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [isBase64Processing, setIsBase64Processing] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const dadosFetch = useSelector((state: RootState) => state.dadosFetch);
  const dadosFetchUpdate = useSelector((state: RootState) => state.dadosFetchUpdate);
  const [touchCount, setTouchCount] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const handleTouchMove = () => {
      setTouchCount((prevCount) => prevCount + 1);
    };
  
    document.addEventListener("touchend", handleTouchMove);
  
    const handleBeforeUnload = (event: { preventDefault: () => void; returnValue: string; }) => {
      event.preventDefault();
      event.returnValue = ''; // Some browsers require a return value for this property
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      document.removeEventListener("touchend", handleTouchMove);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Verificar se dadosFetch é null ou undefined
    if (!dadosFetch || !dadosFetchUpdate) {
      navigate("/agendamento2", { replace: true });
      return;
    }
  }, [dadosFetch, dadosFetchUpdate]);

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
      setIsBase64Processing(true);
      setIsSaveButtonDisabled(true);
      const options = {
        maxSizeMB: 0.3,
        useWebWorker: true,
      };
      try {
        const compressedImage = await compressImage(imagem, options);
        const compressedDataUrl = URL.createObjectURL(compressedImage);
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          setImagemSelecionadaBase64(
            base64String.substring(base64String.lastIndexOf(",") + 1)
          );
          setIsBase64Processing(false);
          setIsSaveButtonDisabled(false);
        };
        reader.readAsDataURL(compressedImage);
      } catch (error) {
        setIsBase64Processing(false);
        setIsSaveButtonDisabled(false);
      }
    }
  };
  
  

  const limparCampos = () => {
    setLacre("");
    setImagemSelecionada(undefined);
    setImagemSelecionadaBase64(undefined);
    setImage(undefined);
  };

  const adicionarItem = async () => {

    limparCampos();
  };
  

  const removerItem = (index: number) => {

  };


  const handleLacreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLacre(event.target.value.toUpperCase());
  };

  const theme = useTheme();

  
  return (
    <>
      <LayoutBaseDePagina titulo="atualização de Checklist" barraDeFerramentas={<></>}>
        <Divider />
        <Box height="100vh" display="flex" flexDirection="column">
          <CardWithGradient sx={{ flex: 1, overflow: "auto" }}>
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
                    onChange={handleLacreChange}
                    helperText={<Typography>Digite o Lacre</Typography>}
                    inputProps={{
                      style: {
                        textAlign: "center", // Centralizar o texto
                        textTransform: "uppercase", // Converter o texto para caixa alta
                      },
                    }}
                  />
                    <LoadingButton
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="contained"
                      onClick={adicionarItem}
                      sx={{ marginBottom: theme.spacing(2) }} // Adicionando uma margem inferior de 2 espaços
                    >
                      {'SALVAR'}
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
                  
                </List>

                <Link to="/agendamento2" style={{ textDecoration: "none" }}>
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

export default Update;
