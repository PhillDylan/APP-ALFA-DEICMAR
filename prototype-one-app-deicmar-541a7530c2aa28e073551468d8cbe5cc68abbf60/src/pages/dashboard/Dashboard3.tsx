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
  TableHead,
  TableBody,
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
import Cookies from 'js-cookie';


import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { Enviroment } from "../../shared/environment";

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
  height: '100%',
  ...(theme.palette.mode !== 'dark' && {
    background: 'linear-gradient(to right, #EBEDEE, #FDFBFB 90%)',
  }),
  ...(theme.palette.mode === 'dark' && {
    background: 'linear-gradient(to right, #282828, #434343 90%)',
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
  const COOKIE_KEY__ID_OPERADOR = 'APP_ID_OPERADOR';
  const COOKIE_KEY__NOME_OPERADOR = 'APP_NOME_OPERADOR';
  const numero = 1

   useEffect(() => {
    if (listaItens.length > 0 || (dadosFetch && dadosFetch.data[numero].container === false)) {
      setGreenChecked(true);
      setRedChecked(false);
    } else {
      setGreenChecked(false);
      setRedChecked(true);
    }

    // Verificar se dadosFetch é null ou undefined
    if (!dadosFetch) {
      navigate('/agendamento2', { replace: true });
      return;
    }
  }, [listaItens, dadosFetch, navigate]);

  const enviarDados = () => {
    console.log('dados',dadosFetch?.data[numero].id)
    // Restante do código do envio dos dados
    // ...

    // Restante do código do envio dos dados
    const base64ToBlob: any = (base64String: any, mimeType: any) => {
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
  var hora: any = new Date().toISOString()
  // Criar um objeto vazio para enviar como null

  var formData = new FormData();
  listaItens.forEach((item: { lacre: string; imagem: Buffer }) => {
    const buffer = item.imagem;
    const blobImage = base64ToBlob(buffer, "image/jpeg");
    const file = new File([blobImage], "imagem.jpg", { type: "image/jpeg" });
    var guide: any = sendNullValues ? 'null' : "item.guide";
    var tipolacre: any = sendNullValues ? 'null' : "NORMAL";
    var agendamento: any = sendNullValues ? 'null' : dadosFetch?.data[numero].id;
    var numerolacre: any = sendNullValues ? 'null' : item.lacre;
    var nomeoperador: any = sendNullValues ? 'null' : Cookies.get(COOKIE_KEY__NOME_OPERADOR);
    var idoperador: any = sendNullValues ? 'null' : Cookies.get(COOKIE_KEY__ID_OPERADOR);
    formData.append("file", file);
    formData.append("string", hora);
    formData.append("string", guide);
    formData.append("string", tipolacre);
    formData.append("string", agendamento);
    formData.append("string", numerolacre);
    formData.append("string", nomeoperador);
    formData.append("string", idoperador);
  });
  const nullObject = [
    hora,"item.guide","NORMAL",dadosFetch?.data[numero].id,"null",Cookies.get(COOKIE_KEY__NOME_OPERADOR),Cookies.get(COOKIE_KEY__ID_OPERADOR),
  ];

// Se dadosFetch.data.obj.container for falso, enviar o objeto nullObject
if (sendNullValues) {
  for (let i = 0; i < nullObject.length; i++) {
    formData.append("string", String(nullObject[i]));
  }
}


    const username: any = "admin";
    const password: any = "speed12345"; // substitua isso pela senha descriptografada
    const token: any = btoa(`${username}:${password}`);
    var options: any = {
      method: "POST",
      headers: {
        Authorization: "Basic " + token,
      },
      body: formData,
    };
    
    fetch(`${Enviroment.URL_BASE}/cadastrolacre`, options)
      .then((response) => {
        console.log(response)
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erro ao enviar");
        }
      })
      .then((data) => {
        if (data.agendamento && data.agendamento.message === "Agendamento cadastrado") {
          navigate('/agendamento2');
        } else {
          setAlertSeverity("error");
          setSeverity("error");
          setOpen(true);
          setMensagemEnvio(data.message);
          setErroEnvio(undefined);
          handleFetchResult(false, data.agendamento.message);
        }
        setAlertMessage(data.agendamento.message);
        console.log(data);
      })
      .catch((error) => {
        setAlertSeverity("error");
        setAlertMessage(error.message);
        console.error(error);
        setSeverity("error");
        setOpen(true);
        setErroEnvio(error.message);
      });
  };
  

  const handleFetchResult = (sucesso: boolean, mensagem: string) => {
    setMensagemEnvio(mensagem);
    setSeverity(sucesso ? "success" : "error");
    setErroEnvio(sucesso ? undefined : mensagem);
  };

  return (
    <>
      <LayoutBaseDePagina
        titulo={`CHECKLIST`}
        barraDeFerramentas={
          <CardWithGradient>
            <CardContent>
              <h3>AGENDAMENTO N° {dadosFetch?.data[numero].id}</h3>
              <h3>SERVIÇO: {dadosFetch?.data[numero].data.cargo[0].service_name}</h3>
            </CardContent>
          </CardWithGradient>
        }
      >
        <Divider />
        <Box height="100vh">
          <CardWithGradient>
          <Stack spacing={0} >
            <CardContent sx={{ textAlign: 'center',  }}>
              <TableContainer component={Paper} variant="outlined" sx={{ m: 0}}>
                <Table >
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Ação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {dadosFetch !== null && dadosFetch?.data[numero].container ? (
  <TableRow>
    <TableCell>
      {redChecked ? (
        <Button variant="outlined" disabled style={{ backgroundColor: 'orange', color: 'black' }}>
          PENDENTE
        </Button>
      ) : (
        <Button variant="outlined" disabled style={{ backgroundColor: 'green', color: 'white' }}>
          PRONTO
        </Button>
      )}
    </TableCell>
    <TableCell>LACRE</TableCell>
    <TableCell>
      <Box marginLeft="auto">
        <Link to="/cadastro-lacre">
          <Button variant="contained">CRIAR</Button>
        </Link>
      </Box>
    </TableCell>
  </TableRow>
) : null}

  
                    <TableRow>
                      <TableCell>
                        {mensagemFetch === true || dadosFetch?.data[numero].face === true ? (
                          <Button variant="outlined" disabled  style={{ backgroundColor: 'green', color: 'white' }}>
                            PRONTO
                          </Button>
                        ) : (
                          <Button variant="outlined" disabled style={{backgroundColor: 'orange', color: 'black' }}>
                            PENDENTE
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>Cadastro Facial</TableCell>
                      <TableCell>
                        <Box marginLeft="auto">
                          <Link to="/cadastro-facial">
                            <Button variant="contained" disabled={mensagemFetch === true || dadosFetch?.data[numero].face === true}>
                              CRIAR
                            </Button>
                          </Link>
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
                <Link to="/agendamento2">
                  <Button size="large" variant="contained">
                    VOLTAR
                  </Button>
                </Link>
  
                <Button
                  variant="contained"
                  size="large"
                  onClick={enviarDados}
                  disabled={!greenChecked || (!mensagemFetch && dadosFetch?.data[numero].face === false)}
                >
                  ENVIAR
                </Button>
              </CardContent>
            </Stack>
          </CardWithGradient>
        </Box>
      </LayoutBaseDePagina>
    </>
  );
  
  
  
  
  
};  

export default Dashboard3;
