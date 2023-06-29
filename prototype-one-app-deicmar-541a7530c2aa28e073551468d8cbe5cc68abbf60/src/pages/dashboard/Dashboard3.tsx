import {
  Divider,
  Grid,
  useTheme,
  Button,
  Paper,
  styled,
  Box,
  IconButton,
  AlertTitle,
  Alert,
  AlertColor,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TableCell,
  Table,
  Theme,
  TableHead,
  TableBody,
  useMediaQuery,
  TableRow,
  TableContainer,
} from "@mui/material";
import { LayoutBaseDePagina } from "../../shared/layouts";
import React, { useEffect, useState } from "react";
import { green, red } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { Enviroment } from "../../shared/environment";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MotionPhotosAuto } from "@mui/icons-material";
    
const label = { inputProps: { "aria-label": "Checkbox demo" } };

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
  height: "100%",
  ...(theme.palette.mode !== "dark" && {
    background: "linear-gradient(to right, #EBEDEE, #FDFBFB 90%)",
  }),
  ...(theme.palette.mode === "dark" && {
    background: "linear-gradient(to right, #282828, #434343 90%)",
  }),
}));

export const Dashboard3 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useTheme();
  const listaItens = useSelector((state: RootState) => state.listaItens); // Obter o estado da store Redux
  const [greenChecked, setGreenChecked] = useState(false);
  const [redChecked, setRedChecked] = useState(true);
  const mensagemFetch = useSelector((state: RootState) => state.mensagemFetch);
  const dadosFetch = useSelector((state: RootState) => state.dadosFetch);
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);
  const [erroEnvio, setErroEnvio] = useState<string | undefined>();
  const [mensagemEnvio, setMensagemEnvio] = useState("");
  const COOKIE_KEY__ID_OPERADOR = "APP_ID_OPERADOR";
  const COOKIE_KEY__NOME_OPERADOR = "APP_NOME_OPERADOR";
  const numero = 1;
  const [statusEnvio, setStatusEnvio] = useState("certo");



  const COOKIE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';
  const Accesstoken = Cookies.get(COOKIE_KEY__ACCESS_TOKEN)
 

  // Estilos personalizados para o alerta
  const alertStyle = {
    background: 'green',
    color: 'white',
  };

  const [touchCount, setTouchCount] = useState(0);

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
    if (
      listaItens.length > 0 ||
      (dadosFetch && dadosFetch.data[numero].container === false)
    ) {
      setGreenChecked(true);
      setRedChecked(false);
    } else {
      setGreenChecked(false);
      setRedChecked(true);
    }

    // Verificar se dadosFetch é null ou undefined
    if (!dadosFetch) {
      navigate("/agendamento2", { replace: true });
      return;
    }
  }, [listaItens, dadosFetch, navigate,mensagemFetch]);

  const enviarDados = () => {
    setStatusEnvio("enviando");
    // Restante do código do envio dos dados
    // ...

    // Restante do código do envio dos dados
    const base64ToBlob: any = async (base64String: any, mimeType: any) => {
      const byteCharacters: any = atob(base64String);
      const byteArrays: any = [];
      for (let offset: any = 0; offset < byteCharacters.length; offset += 512) {
        const slice: any = byteCharacters.slice(offset, offset + 512);
        const byteNumbers: any = new Array(slice.length);
        for (let i: any = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray: any = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: mimeType });
    };

    // Verificar se dadosFetch.data.obj.container é falso
    const sendNullValues = !dadosFetch?.data[numero].container;
    var hora: any = new Date().toISOString();
    // Criar um objeto vazio para enviar como null

// Certifique-se de que essa função esteja marcada como assíncrona.

async function processItems(listaItens: any[]) {
  var formData = new FormData();
  await Promise.all(listaItens.map(async (item: { lacre: string; imagem: Buffer }) => {
    const buffer = item.imagem;
    const blobImage = await base64ToBlob(buffer, "image/jpeg");
    const file = new File([blobImage], "imagem.jpg", { type: "image/jpeg" });
    var numerolacre: any = sendNullValues ? "null" : item.lacre;
    formData.append(numerolacre, file);
  }));
  var guide: any = sendNullValues ? "null" : "item.guide";
  var tipolacre: any = sendNullValues ? "null" : "NORMAL";
  var agendamento: any = sendNullValues ? "null" : dadosFetch?.data[numero].id;
  var nomeoperador: any = sendNullValues ? "null"  : Cookies.get(COOKIE_KEY__NOME_OPERADOR);
  var idoperador: any = sendNullValues ? "null" : Cookies.get(COOKIE_KEY__ID_OPERADOR);
  var MotoristaCPF: any = sendNullValues ? "null" : dadosFetch?.data[numero].data.driver.cpf;
  var MotoristaNome: any = sendNullValues ? "null" : dadosFetch?.data[numero].data.driver.name;
  var MotoristaCNH: any = sendNullValues ? "null" : dadosFetch?.data[numero].data.driver.license_number;
  var CargoTrailer_Vehicle: any = sendNullValues ? "null" : dadosFetch?.data[numero].data.trailer_vehicle;
  var CargoVehicle: any = sendNullValues ? "null" : dadosFetch?.data[numero].data.vehicle;
  var CargoYard_Name: any = sendNullValues ? "null" : dadosFetch?.data[numero].data.yard_name;
  var CargoService: any = sendNullValues ? "null" : dadosFetch?.data[numero].data.cargo[0].service_name;
  var CargoType: any = sendNullValues ? "null" : dadosFetch?.data[numero].data.cargo[0].cargo_type;
  var CargoIn_or_out: any = sendNullValues ? "null" : dadosFetch?.data[numero].data.cargo[0].in_or_out;
  var cargo_number: any = sendNullValues ? "null" : dadosFetch?.data[numero].data.cargo[0].cargo_number;
  console.log("feshfuiawehfiuaswhegiuear",dadosFetch)
   formData.append("hora", hora);
   formData.append("guide", guide);
   formData.append("tipolacre", tipolacre);
   formData.append("agendamento", agendamento);
   formData.append("nomeoperador", nomeoperador);
   formData.append("idoperador", idoperador); 
   formData.append("motoristaInformationCPF", MotoristaCPF)
   formData.append("motoristaInformationNOME", MotoristaNome)
   formData.append("motoristaInformationCNH", MotoristaCNH)
   formData.append("cargoInformationCargoTrailer_Vehicle", CargoTrailer_Vehicle)
   formData.append("cargoInformationCargoVehicle", CargoVehicle)
   formData.append("cargoInformationCargoYard_Name", CargoYard_Name)
   formData.append("cargoInformationCargoService", CargoService)
   formData.append("cargoInformationCargoType", CargoType)
   formData.append("cargoInformationCargoIn_or_out", CargoIn_or_out)
   formData.append("cargoInformationCargo_number", cargo_number)


  return formData
}

// Chame a função processItems e envolva-a em uma função assíncrona.
async function exampleFunction() {
  let formData: any = await processItems(listaItens);

  return formData;
}

    exampleFunction().then((formData) => {
          // Verificar se dadosFetch.data.obj.container é falso
    const sendNullValues = !dadosFetch?.data[numero].container;
      const nullObject = {
        hora: hora,
        guide: "item.guide",
        tipo_Lacre: "NORMAL",
        Agendamento: dadosFetch?.data[numero].id,
        Lacres:"null",
        Operador: Cookies.get(COOKIE_KEY__NOME_OPERADOR),
        ID_Operador: Cookies.get(COOKIE_KEY__ID_OPERADOR),
        MotoristaCPF:  dadosFetch?.data[numero].data.driver.cpf,
        MotoristaNome:  dadosFetch?.data[numero].data.driver.name,
        MotoristaCNH:  dadosFetch?.data[numero].data.driver.license_number,
        CargoTrailer_Vehicle:  dadosFetch?.data[numero].data.trailer_vehicle,
        CargoVehicle:  dadosFetch?.data[numero].data.vehicle,
        CargoYard_Name:  dadosFetch?.data[numero].data.yard_name,
        CargoService:  dadosFetch?.data[numero].data.cargo[0].service_name,
        CargoType:  dadosFetch?.data[numero].data.cargo[0].cargo_type,
        CargoIn_or_out:  dadosFetch?.data[numero].data.cargo[0].in_or_out,
        cargo_number:  dadosFetch?.data[numero].data.cargo[0].cargo_number
    };
  
      // Se dadosFetch.data.obj.container for falso, enviar o objeto nullObject
      if (sendNullValues) {
        formData.append("Dados", JSON.stringify(nullObject));
      }
      const username = Enviroment.USERNAME;
      const password = Enviroment.PASSWORD; // substitua isso pela senha descriptografada
      const token: any = btoa(`${username}:${password}`);
      var options: any = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + Accesstoken 

        },
        body: formData,
      };
  
      fetch(`${Enviroment.URL_BASE}/cadastrolacre`, options)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Erro ao enviar");
          }
        })
        .then((data) => {
          setStatusEnvio("pronto");
          if (
            data.agendamento &&
            data.agendamento.message === "Agendamento cadastrado"
          ) {
            toast.success(data.agendamento.message, { style: alertStyle });
            navigate("/agendamento2");
          } else {
            setStatusEnvio("erro");
            setAlertSeverity("error");
            setSeverity("error");
            setOpen(true);
            setMensagemEnvio(data.message);
            setErroEnvio(undefined);
            handleFetchResult(false, data.agendamento.message);
          }
          setAlertMessage(data.agendamento.message);
        })
        .catch((error) => {
          setStatusEnvio("erro");
          setAlertSeverity("error");
          setAlertMessage(error.message);
          console.error(error);
          setSeverity("error");
          setOpen(true);
          setErroEnvio(error.message);
        });
    });
  
  };

  const handleFetchResult = (sucesso: boolean, mensagem: string) => {
    setMensagemEnvio(mensagem);
    setSeverity(sucesso ? "success" : "error");
    setErroEnvio(sucesso ? undefined : mensagem);
  };

  // Media queries to determine screen size
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <>
      <LayoutBaseDePagina
        titulo={`CHECKLIST`}
        barraDeFerramentas={
          <CardWithGradient>
            <CardContent>
              <Typography
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                AGENDAMENTO N° {dadosFetch?.data[numero].id}
              </Typography>
              <Typography
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                SERVIÇO: {dadosFetch?.data[numero].data.cargo[0].service_name}
              </Typography>
            </CardContent>
          </CardWithGradient>
        }
      >
        <Divider />
        <Box height="80vh" display="flex" flexDirection="column">
          <CardWithGradient sx={{ flex: 1, overflow: "auto" }}>
            <Stack spacing={5}>
              <CardContent sx={{ textAlign: "center" }}>
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ m: 0 }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Ação</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dadosFetch !== null &&
                      dadosFetch?.data[numero].container ? (
                        <TableRow>
                          <TableCell>
                            {redChecked ? (
                              <Button
                                variant="outlined"
                                disabled
                                style={{
                                  backgroundColor: "orange",
                                  color: "black",
                                }}
                              >
                                PENDENTE
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                disabled
                                style={{
                                  backgroundColor: "green",
                                  color: "white",
                                }}
                              >
                                PRONTO
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>LACRE</TableCell>
                          <TableCell>
                            <Box marginLeft="auto">
                              <Link to="/cadastro-lacre" style={{ textDecoration: "none" }}>
                                <Button variant="contained">CRIAR</Button>
                              </Link>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : null}

                      <TableRow>
                        <TableCell>
                          {mensagemFetch === true ||
                          dadosFetch?.data[numero].face === true ? (
                            <Button
                              variant="outlined"
                              disabled
                              style={{
                                backgroundColor: "green",
                                color: "white",
                              }}
                            >
                              PRONTO
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              disabled
                              style={{
                                backgroundColor: "orange",
                                color: "black",
                              }}
                            >
                              PENDENTE
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>Cadastro Facial</TableCell>
                        <TableCell>
                          <Box marginLeft="auto">
                          {mensagemFetch === false && dadosFetch?.data[numero].face === false  && (
                            <Link to="/cadastro-facial" style={{ textDecoration: "none" }}>
                              <Button
                                variant="contained"
                              >
                                CRIAR
                              </Button>
                            </Link>
                            )} 
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Collapse in={open}>
                  <Alert
                    variant="filled"
                    severity={severity}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    <AlertTitle>{severity}</AlertTitle>
                    {erroEnvio || mensagemEnvio}
                  </Alert>
                </Collapse>

                <Box display="flex" justifyContent="center" marginTop={2}>
    {statusEnvio !== "enviando" && statusEnvio !== "erro" && (
      <Link to="/agendamento2" style={{textDecorationLine:"none"}}>
        <Button size="large" variant="contained">
          VOLTAR
        </Button>
      </Link>
    )}

    <Box marginLeft={4}>
      <Button
        variant="contained"
        size="large"
        onClick={enviarDados}
        disabled={
          !greenChecked ||
          (!mensagemFetch && dadosFetch?.data[numero].face === false) ||
          statusEnvio === "enviando"
        }
      >
        {statusEnvio === "enviando"
          ? "ENVIANDO..."
          : statusEnvio === "pronto"
          ? "ENVIADO"
          : statusEnvio === "erro"
          ? "REENVIAR"
          : "ENVIAR"}
      </Button>
    </Box>
  </Box>
              </CardContent>
            </Stack>
          </CardWithGradient>
        </Box>
      </LayoutBaseDePagina>
    </>
  );
};

export default Dashboard3;
