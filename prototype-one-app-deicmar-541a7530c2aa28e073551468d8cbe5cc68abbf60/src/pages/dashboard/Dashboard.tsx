import { LayoutBaseDePagina } from "../../shared/layouts";
import { PhotoCamera } from "@mui/icons-material";
import {
  Alert,
  AlertColor,
  AlertTitle,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { NewPost } from "../../shared/components";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Enviroment } from "../../shared/environment";
import debounce from "lodash.debounce"; // Importe o debounce do pacote lodash.debounce
import { RootState } from "./store";



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



export const Dashboard = () => {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);
  const [erroEnvio, setErroEnvio] = useState<string | undefined>();
  const [mensagemEnvio, setMensagemEnvio] = useState("");
  const [mensagemCPF, setMensagemCPF] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCpf] = useState("");
  const [statusEnvio, setStatusEnvio] = useState("certo");
  const [file, setFile] = useState<Blob | undefined>();
  const [image, setImage] = useState<
    { url: string; width: number; height: number } | undefined
  >();
  const [imagemBase64, setImagemBase64] = useState<string | undefined>();
  const [imagemSelecionada, setImagemSelecionada] = useState<
    string | undefined
  >();
  const [upImage, setResultImage] = useState<
    { url: string; width: number; height: number } | undefined
  >();
  const dadosFetch = useSelector((state: RootState) => state.dadosFetch);
  const numero = 1;

  const dispatch = useDispatch();

  const handleFetchResult = (sucesso: boolean, mensagem: string) => {
    setMensagemEnvio(mensagem);
    setSeverity(sucesso ? "success" : "error");
    setErroEnvio(sucesso ? undefined : mensagem);
    setStatusEnvio(sucesso ? "certo" : "errado");
    dispatch({ type: "SET_MENSAGEM_FETCH", payload: sucesso });
  };

  const [enviando, setEnviando] = useState(false); // Nova variável de estado

  const [touchCount, setTouchCount] = useState(0);

  useEffect(() => {
    // Verificar se dadosFetch é null ou undefined
    if (!dadosFetch) {
      navigate("/agendamento2", { replace: true });
      return;
    }
  }, [dadosFetch]);

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



  const ValidadorCPF = (cpf: any) => {
    // inicia as variaveis que serão ultilizadas no codigo
    var Soma: any,
      i: any,
      Resto: any,
      CPF = cpf;
    // pega o cpf informado e retira os '.' e o  '-' para fazer a verificação
    CPF = String(
      CPF.replace("-", "")
        .replace(".", "")
        .replace(/[^0-9]/g, "")
    );
    Soma = 0;
    // verifica se os caracteres são todos iguais
    if (
      CPF.length !== 11 ||
      !Array.from(CPF).filter((e) => e !== CPF[0]).length
    ) {
      CPF = false;
      return CPF;
    }
    //faz o calculo de verificação de todos os digitos para verificar se o CPF é valido
    for (i = 1; i <= 9; i++)
      Soma = Soma + parseInt(CPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;
    if (Resto === 10 || Resto === 11) Resto = 0;
    if (Resto != parseInt(CPF.substring(9, 10))) {
      CPF = false;
      return CPF;
    }
    Soma = 0;
    for (i = 1; i <= 10; i++)
      Soma = Soma + parseInt(CPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;
    if (Resto === 10 || Resto === 11) Resto = 0;
    if (Resto !== parseInt(CPF.substring(10, 11))) {
      CPF = false;
      return CPF;
    }
    CPF = true;
    return CPF;
  };

  const temErro = nome.length < 3 || sobrenome.length < 3 || !ValidadorCPF(cpf);

  const updateImage = async (e: {
    url?: string;
    width: number;
    height: number;
  }) => {
    if (!e.url) return;
    const response = await fetch(e.url);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      let base64String = reader.result?.toString();
      const index = base64String?.indexOf(",");
      if (index) {
        if (index !== -1) {
          base64String = base64String?.slice(index + 1);
        }
      }
      setImagemBase64(base64String);
    };
  };

  useEffect(() => {
    const username = Enviroment.USERNAME;
    const password = Enviroment.PASSWORD;
    const token = btoa(`${username}:${password}`);
    fetch(`${Enviroment.URL_BASE}/api/groupsid`, { //api/groupsid
      method: "GET",
      headers: { Authorization: "Basic " + token },
    })
      .then((response) => response.json())
      .then((data) => {
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const getImage = () => {
      if (file != null) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx != null) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const image = new Image();
                  image.src = URL.createObjectURL(blob);
                  image.onload = () => {};
                  setImage({
                    url: image.src,
                    width: image.width,
                    height: image.height,
                  });
                }
              },
              "image/jpeg",
              1
            );
          }
        };
      }
    };
    getImage();
  }, [file]);

  const handleImagemSelecionada = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(undefined);
      setImage(undefined);
      setImagemBase64(undefined);
      setImagemSelecionada(undefined);
      const imagem = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(imagem);
      reader.onload = async () => {
        let imagemBase64 = reader.result as string;
        const index = imagemBase64.indexOf(",");
        if (index !== -1) {
          imagemBase64 = imagemBase64.slice(index + 1);
        }
        setImagemBase64(imagemBase64);
        setImagemSelecionada(imagemBase64);
      };
      reader.onerror = () => {
        console.error("Erro ao converter imagem em base64");
      };
      setFile(imagem);
    }
  };

  const handleApagarImagem = () => {
    setFile(undefined);
    setImage(undefined);
    setImagemBase64(undefined);
    setImagemSelecionada(undefined);
  };

  const removeCaracteresCPF = (cpf: string) => {
    return cpf.replace(/[.-]/g, "");
  };

  const theme = useTheme();


  const handleNomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value.toUpperCase());
  };

  const handleSobrenomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSobrenome(event.target.value.toUpperCase());
  };

  const handleCPFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputCPF = event.target.value.replace(/[^\d]/g, "");
    let formattedCPF = "";

    if (inputCPF.length <= 3) {
      formattedCPF = inputCPF;
    } else if (inputCPF.length <= 6) {
      formattedCPF = inputCPF.substr(0, 3) + "." + inputCPF.substr(3);
    } else if (inputCPF.length <= 9) {
      formattedCPF =
        inputCPF.substr(0, 3) +
        "." +
        inputCPF.substr(3, 3) +
        "." +
        inputCPF.substr(6);
    } else {
      formattedCPF =
        inputCPF.substr(0, 3) +
        "." +
        inputCPF.substr(3, 3) +
        "." +
        inputCPF.substr(6, 3) +
        "-" +
        inputCPF.substr(9);
    }

    setCpf(formattedCPF);
      // Verificar se o CPF digitado é igual ao CPF do agendamento
      const cpfAgendamento = dadosFetch?.data[numero].data.driver.cpf.replace(/[.-]/g, '');

      if (ValidadorCPF(inputCPF) && cpfAgendamento === inputCPF) {
        setStatusEnvio("certo");
        setMensagemCPF("CPF válido");
      } else {
        setStatusEnvio("errado");
        setMensagemCPF("CPF digitado não confere com o do agendamento");
      }
      
  };

  // Lógica para definir a mensagem de erro
const helperTextCPF = !ValidadorCPF(cpf) ? "Digite um CPF válido" : mensagemCPF;


  return (
    <>
      <LayoutBaseDePagina titulo="Cadastro Facial" barraDeFerramentas={<></>}>
        <Divider />
        <Box height="100vh" display="flex" flexDirection="column">
          <CardWithGradient sx={{ flex: 1, overflow: "auto" }}>
            <Stack spacing={5}>
            <CardContent>
            <Item>
              {image ? (
                <Card variant="outlined">
                <NewPost image={image} handleResult={updateImage} />
                </Card>
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
                  </label>
                  <input
                    onChange={handleImagemSelecionada}
                    id="file"
                    style={{ display: "none" }}
                    type="file"
                  />
                </>
              )}
              {image && (
                <Grid item>
                  <Grid item>
                    <label htmlFor="file">
                      <LoadingButton
                        loading={false}
                        loadingPosition="start"
                        startIcon={<PhotoCamera />}
                        variant="outlined"
                        aria-label="upload picture"
                        component="span"
                      >
                        TROCAR IMAGEM
                      </LoadingButton>
                    </label>
                    <input
                      onChange={handleImagemSelecionada}
                      id="file"
                      style={{ display: "none" }}
                      type="file"
                    />
                  </Grid>
                </Grid>
              )}
              <Grid
                item
                paddingX={{ xs: theme.spacing(5), md: theme.spacing(20) }}
              >
                <TextField
                  fullWidth
                  placeholder="NOME"
                  error={nome.length < 3}
                  required
                  InputLabelProps={{ shrink: true }}
                  id="outlined-required"
                  label={<Typography>OBRIGATORIO</Typography>}
                  margin={"normal"}
                  value={nome}
                  onChange={handleNomeChange}
                  helperText={<Typography>Digite o nome</Typography>}
                  inputProps={{
                    style: {
                      textAlign: "center", // Centralizar o texto
                    },
                  }}
                />
              </Grid>
              <Grid
                item
                paddingX={{ xs: theme.spacing(5), md: theme.spacing(20) }}
                textAlign="center"
              >
               <TextField
                fullWidth
                placeholder="SOBRENOME"
                error={sobrenome.length < 3}
                required
                id="outlined-required"
                label={<Typography>OBRIGATORIO</Typography>}
                value={sobrenome}
                InputLabelProps={{ shrink: true }}
                margin={"normal"}
                onChange={handleSobrenomeChange}
                helperText={<Typography>Digite o Sobrenome</Typography>}
                inputProps={{
                  style: {
                    textAlign: "center", // Centralizar o texto
                  },
                }}
              />
              </Grid>
              <Grid
                item
                paddingX={{ xs: theme.spacing(5), md: theme.spacing(20) }}
              >
                <TextField
                  fullWidth
                  margin={"normal"}
                  placeholder="00.000.000-00"
                  error={!ValidadorCPF(cpf)}
                  id="filled-number"
                  label={<Typography>OBRIGATORIO</Typography>}
                  type="tel"
                  InputLabelProps={{ shrink: true }}
                  value={cpf}
                  onChange={handleCPFChange}
                  inputProps={{ maxLength: 14, style: { textAlign: "center" } }}
                  helperText={mensagemCPF? <Typography>{mensagemCPF}</Typography>: <Typography>"Digite o CPF"</Typography>}
                />
              </Grid>
              <Grid item>
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
                        {" "}
                        <CloseIcon fontSize="inherit" />{" "}
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    <AlertTitle>{severity}</AlertTitle>
                    {erroEnvio || mensagemEnvio}
                  </Alert>
                </Collapse>
              </Grid>
              <Grid item>

            {statusEnvio !== 'enviando' && (
              <Link to="/checklist">
                <Button size="large" variant="contained">
                  VOLTAR
                </Button>
              </Link>
            )}

          <Button
            size="large"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={
              !nome ||
              !sobrenome ||
              !cpf ||
              statusEnvio === "enviando" ||
              open === true ||
              temErro ||
              !imagemBase64 ||
              mensagemCPF === "CPF digitado não confere com o do agendamento"
            }
            onClick={async () => {
              if (
                !nome ||
                !sobrenome ||
                !cpf ||
                statusEnvio === "enviando" ||
                open === true ||
                temErro ||
                !imagemBase64
              ) {
                return; // Impede a execução do código quando o botão estiver desabilitado
              }

              setStatusEnvio("enviando");
                    setEnviando(true); // Ativa o estado de "enviando"
                    const username = Enviroment.USERNAME;
                    const password = Enviroment.PASSWORD;
                    const token = btoa(`${username}:${password}`);
                    const cpfSemCaracteres = removeCaracteresCPF(cpf);
                    fetch(`${Enviroment.URL_BASE}/api/cadastro`, {
                      method: "POST",
                      headers: { Authorization: "Basic " + token },
                      body: JSON.stringify({
                        nome,
                        sobrenome,
                        cpf: cpfSemCaracteres,
                        imagem: imagemBase64,
                        transportadora: 6,
                      }),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        if (data.status === "Success") {
                          setStatusEnvio("pronto");
                          setEnviando(false);
                          setNome("");
                          setSobrenome("");
                          setCpf("");
                          setImagemBase64(undefined);
                          setImagemSelecionada(undefined);
                          setOpen(true);
                          setMensagemEnvio(data.message);
                          setErroEnvio(undefined);
                          handleFetchResult(true, data.message);
                          navigate("/checklist");
                        } else {
                          setSeverity("error");
                          setOpen(true);
                          setMensagemEnvio(data.message);
                          setStatusEnvio("erro");
                          setErroEnvio(undefined);
                          handleFetchResult(false, data.message);
                          setEnviando(false);

                        }
                      })
                      .catch((error) => {
                        console.error(error);
                        setSeverity("error");
                        setOpen(true);
                        setStatusEnvio("erro");
                        setErroEnvio(error.message);
                        setEnviando(false);

                      });

            }}
          >
            {statusEnvio === "enviando"
              ? "ENVIANDO..."
              : statusEnvio === "pronto"
              ? "ENVIADO"
              : statusEnvio === "erro"
              ? "REENVIAR"
              : "ENVIAR"}
          </Button>

              </Grid>
          </Item>
          </CardContent>
          </Stack>
          </CardWithGradient>
          </Box>
      </LayoutBaseDePagina>
    </>
  );
};

        