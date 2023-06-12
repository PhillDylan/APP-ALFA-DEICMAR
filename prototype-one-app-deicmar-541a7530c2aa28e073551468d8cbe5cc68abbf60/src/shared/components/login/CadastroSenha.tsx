import React, { useState } from 'react';
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

const secretKey = "sua_chave_de_criptografia";
const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000'); // IV fixo

interface ICadastroSenhaProps {
  email: string;
}

export const CadastroSenha: React.FC<ICadastroSenhaProps> = ({ email }) => {
  const { login } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('');

  const COOKIE_KEY__ID_OPERADOR = 'APP_ID_OPERADOR';
  const COOKIE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';

  const handleFetchResult = (sucesso: boolean, mensagem: string) => {
    setSeverity(sucesso ? 'success' : 'error');
    setOpen(true);
  };

  const handleNavegar = () => {
    window.location.href = '/direct';
  };

  const encrypt = (data: string): string => {
    const derivedKey = CryptoJS.PBKDF2(secretKey, iv, { keySize: 256 / 32, iterations: 100 }); // Chave derivada do IV
    const encryptedData = CryptoJS.AES.encrypt(data, derivedKey, { iv }).toString();
    return encryptedData;
  };

  const decrypt = (encryptedData: string): string => {
    const derivedKey = CryptoJS.PBKDF2(secretKey, iv, { keySize: 256 / 32, iterations: 100 }); // Chave derivada do IV
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, derivedKey, { iv });
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  };


  const handleSubmit = () => {
    if (password.length < 5) {
      setPasswordError('A senha deve ter pelo menos 5 caracteres');
      return;
    }
    setIsLoading(true);
    Cookies.remove(COOKIE_KEY__ACCESS_TOKEN);

    // Fazer a requisição para cadastrar nova senha e obter o access_token

    // Exemplo fictício:
    const username = Enviroment.USERNAME;
    const userPassword = Enviroment.PASSWORD;
    const token = btoa(`${username}:${userPassword}`);
    const concatenatedData = `${email}:${password}`; // Use a senha original, não o hash
    const encryptedData = encrypt(concatenatedData);
    const dataToSend = `cripto: ${encryptedData}, user: ${Cookies.get(COOKIE_KEY__ID_OPERADOR)}`;
    fetch(`${Enviroment.URL_BASE}/updatepassword`, {
      method: 'POST',
      body: dataToSend,
      headers: { Authorization: "Basic " + token },
    })
      .then((response) => response.json())
      .then((data) => {
        // Salvar o access_token no cookie
        Cookies.set(COOKIE_KEY__ACCESS_TOKEN, data.access_token, { expires: Enviroment.DIAS_EXPIRACAO });

        // Fazer o login com o novo access_token
        login(email, password)
          .then(() => {
            setIsLoading(false);
            handleFetchResult(true, 'Senha cadastrada com sucesso');
            handleNavegar()
          });
      })
      .catch((error) => {
        setIsLoading(false);
        handleFetchResult(false, 'Erro ao cadastrar nova senha');
      });
          // Limpe o erro de senha se a validação for bem-sucedida
    setPasswordError('');
  };

  const [showPassword, setShowPassword] = useState(false);

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
                    setOpen(false);
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
