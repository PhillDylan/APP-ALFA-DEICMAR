import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardActions, CardContent, CircularProgress, Collapse, Grid, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuthContext } from '../../contexts';
import Cookies from 'js-cookie';
import { Enviroment } from '../../environment';
import CryptoJS from "crypto-js";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const secretKey = "sua_chave_de_criptografia"; // Chave de criptografia usada para criptografar e descriptografar dados sensíveis
const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000'); // IV fixo (Inicialização do Vetor)

interface ICadastroSenhaProps {
  email: string; // Propriedade recebida pelo componente para o e-mail do usuário
}

  // Estilos personalizados para o alerta
  const alertStyle = {
    background: 'green',
    color: 'white',
  };



export const CadastroSenha: React.FC<ICadastroSenhaProps> = ({ email }) => { // Componente CadastroSenha que recebe a prop email
  const { login } = useAuthContext(); // Hook personalizado de contexto para autenticação
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento
  const [passwordError, setPasswordError] = useState(''); // Estado para armazenar mensagens de erro de senha
  const [password, setPassword] = useState(''); // Estado para armazenar a senha digitada pelo usuário
  const [open, setOpen] = useState(false); // Estado para controlar a exibição do Alerta de sucesso ou erro
  const [severity, setSeverity] = useState(''); // Estado para definir o tipo de alerta (sucesso ou erro)

  const COOKIE_KEY__ID_OPERADOR = 'APP_ID_OPERADOR'; // Chave para o cookie do ID do operador
  const COOKIE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN'; // Chave para o cookie do token de acesso

  const Accesstoken = Cookies.get(COOKIE_KEY__ACCESS_TOKEN)
 
  const handleFetchResult = (sucesso: boolean, mensagem: string) => { // Função para lidar com o resultado do cadastro da nova senha
    setSeverity(sucesso ? 'success' : 'error'); // Define a gravidade do alerta como 'success' se sucesso for verdadeiro, caso contrário, 'error'
    setOpen(true); // Abre o Alerta
  };

  const handleNavegar = () => {
    window.location.href = '/direct'; // Navega para a página '/direct'
  };

  const encrypt = (data: string): string => { // Função para criptografar dados
    const derivedKey = CryptoJS.PBKDF2(secretKey, iv, { keySize: 256 / 32, iterations: 100 }); // Chave derivada do IV
    const encryptedData = CryptoJS.AES.encrypt(data, derivedKey, { iv }).toString(); // Criptografa os dados usando a chave derivada e o IV
    return encryptedData; // Retorna os dados criptografados
  };

  const decrypt = (encryptedData: string): string => { // Função para descriptografar dados
    const derivedKey = CryptoJS.PBKDF2(secretKey, iv, { keySize: 256 / 32, iterations: 100 }); // Chave derivada do IV
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, derivedKey, { iv }); // Descriptografa os dados usando a chave derivada e o IV
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8); // Converte os bytes descriptografados em uma string UTF-8
    return decryptedData; // Retorna os dados descriptografados
  };

  const handleSubmit = () => { // Função para lidar com o envio do formulário de cadastro da nova senha
    if (password.length < 5) { // Verifica se a senha tem pelo menos 5 caracteres
      setPasswordError('A senha deve ter pelo menos 5 caracteres'); // Define a mensagem de erro para a senha
      return; // Retorna se a validação falhar
    }
    setIsLoading(true); // Define isLoading como true para mostrar o carregamento
    //Cookies.remove(COOKIE_KEY__ACCESS_TOKEN); // Remove o cookie do token de acesso

    // Fazer a requisição para cadastrar nova senha e obter o access_token

    // Exemplo fictício:
    const username = Enviroment.USERNAME; // Obtém o nome de usuário do ambiente
    const userPassword = Enviroment.PASSWORD; // Obtém a senha do usuário do ambiente
    const token = btoa(`${email}:${password}`); // Codifica o nome de usuário e senha em Base64
    const concatenatedData = `${email}:${password}`; // Concatena o e-mail e a senha
    const encryptedData = encrypt(concatenatedData); // Criptografa os dados concatenados
    const dataToSend = `cripto: ${token}, user: ${Cookies.get(COOKIE_KEY__ID_OPERADOR)}`; // Prepara os dados para enviar
    fetch(`${Enviroment.URL_BASE}/updatepassword`, { // Faz uma solicitação POST para a rota de atualização de senha
      method: 'POST',
      body: dataToSend, // Envia os dados criptografados
      headers: {   Authorization: "Bearer " + Accesstoken   }, // Define o cabeçalho de autorização com o token codificado em Base64
    })
      .then((response) => response.json()) // Converte a resposta em JSON
      .then((data) => {
         if (data.message === "Token invalido!"){
          let COOKIE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';
          let COOKIE_KEY__ID_OPERADOR = 'APP_ID_OPERADOR';
          let COOKIE_KEY__MESSAGE = 'APP_MESSAGE';
          let COOKIE_KEY__NOME_OPERADOR = 'APP_NOME_OPERADOR';
          let COOKIE_KEY__GATE = 'APP_GATE';
          let COOKIE_KEY__FIRST_ACCESS = 'APP_FIRST_ACCESS';
          Cookies.remove(COOKIE_KEY__ACCESS_TOKEN);
          Cookies.remove(COOKIE_KEY__ID_OPERADOR);
          Cookies.remove(COOKIE_KEY__NOME_OPERADOR);
          Cookies.remove(COOKIE_KEY__GATE);
          Cookies.remove(COOKIE_KEY__FIRST_ACCESS);
          handleNavegar();
        }
        // Salvar o access_token no cookie
        Cookies.set(COOKIE_KEY__ACCESS_TOKEN, data.access_token, { expires: Enviroment.DIAS_EXPIRACAO }); // Define o cookie do token de acesso com a data de expiração

        // Fazer o login com o novo access_token
        login(email, password) // Chama a função de login com o e-mail e a senha
          .then(() => {
            setIsLoading(false); // Define isLoading como false para ocultar o carregamento
            handleFetchResult(true, 'Senha cadastrada com sucesso'); // Lida com o resultado do cadastro da nova senha
            toast.success('Senha cadastrada com sucesso', { style: alertStyle });
            handleNavegar(); // Navega para a página '/direct'
          });
      })
      .catch((error) => {
        setIsLoading(false); // Define isLoading como false para ocultar o carregamento
        handleFetchResult(false, 'Erro ao cadastrar nova senha'); // Lida com o resultado do cadastro da nova senha
      });
      
    setPasswordError(''); // Limpa o erro de senha se a validação for bem-sucedida
  };

  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

  return (
    <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
      <Card sx={{ maxWidth: 400, mx: 2, textAlign: 'center' }} >
        <CardContent sx={{ mb: 2 }}>
          <Typography variant="h6" align="center">Cadastrar Nova Senha</Typography>

          <TextField
            fullWidth
            label="Login"
            value={email}
            disabled
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Nova Senha"
            type={showPassword ? 'text' : 'password'}
            value={password}
            disabled={isLoading}
            error={!!passwordError}
            helperText={passwordError}
            onKeyDown={() => setPasswordError('')}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Collapse in={open}>
            <Alert
              variant="filled"
              severity={severity as any}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false); // Fecha o Alerta
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {severity === 'success' ? 'Senha cadastrada com sucesso' : 'Erro ao cadastrar nova senha'}
            </Alert>
          </Collapse>
        </CardContent>
        <CardActions sx={{ mb: 2 }}>
          <Grid container justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                disabled={isLoading}
                onClick={handleSubmit}
                endIcon={isLoading ? <CircularProgress variant="indeterminate" color="inherit" size={20} /> : undefined}
              >
                Cadastrar
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Box>
  );
};
