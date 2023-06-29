import { useState } from 'react';
import { Alert, AlertColor, Box, AlertTitle ,Button, Card, CardActions, CardContent, CircularProgress, Collapse, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import * as yup from 'yup';
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuthContext, useAppThemeContext } from '../../contexts';
import React from 'react';
import Cookies from 'js-cookie';
import { CadastroSenha } from './CadastroSenha';


// Definição do schema de validação para o formulário de login
const loginSchema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required().min(5),
});

interface ILoginProps {
  children: React.ReactNode;
}

export const Login: React.FC<ILoginProps> = ({ children }) => {
  const { isAuthenticated, login } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);
  const [erroEnvio, setErroEnvio] = useState<string | undefined>();
  const [mensagemEnvio, setMensagemEnvio] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirectToNewPassword, setRedirectToNewPassword] = useState(false);

  // Verifica se o e-mail contém espaços em branco
  React.useEffect(() => {
    if (email.trim().includes(' ')) {
      setEmailError('O Login não pode conter espaços em branco');
    } else {
      setEmailError('');
    }
  }, [email]);
  
  // Função para tratar o resultado da requisição de login
  const handleFetchResult = (sucesso: boolean, mensagem: string | undefined) => {
    if(mensagem){
    setMensagemEnvio(mensagem);
    setSeverity(sucesso ? "success" : "error");
    setErroEnvio(sucesso ? undefined : mensagem);
    setOpen(true)
    }
  };

const COOKIE_KEY__MESSAGE = 'APP_MESSAGE';

const message = Cookies.get(COOKIE_KEY__MESSAGE);


  // Função para lidar com o envio do formulário de login
  const handleSubmit = () => {
    setIsLoading(true);
  
    loginSchema
      .validate({ email, password }, { abortEarly: false })
      .then((dadosValidados) => {
        login(dadosValidados.email, dadosValidados.password)
          .then(() => {
            setIsLoading(false);
            handleFetchResult(false, message);
            if (Cookies.get('APP_FIRST_ACCESS') === 'true') {
              setRedirectToNewPassword(true);
              setIsLoading(false);
              return;
            }
          });
      })
      .catch((errors: yup.ValidationError) => {
        setIsLoading(false);
  
        errors.inner.forEach((error) => {
          if (error.path === 'email') {
            setEmailError(error.message);
          } else if (error.path === 'password') {
            setPasswordError(error.message);
          }
        });
      });
  };
  
  // Verifica se é necessário redirecionar para a página de cadastro de senha
  if (redirectToNewPassword) {
    return <CadastroSenha email={email} />;
  }
  
    // Se o usuário estiver autenticado, exibe o conteúdo da página
    if (isAuthenticated) {
      Cookies.remove(COOKIE_KEY__MESSAGE);
    }


  // Se o usuário estiver autenticado, exibe o conteúdo da página
  if (isAuthenticated) return (
    <>{children}</>
  );


  return (
    <Box width='100vw' height='100vh' display='flex' alignItems='center' justifyContent='center'>

      <Card>
        <CardContent>
          <Box display='flex' flexDirection='column' gap={2} width={250}>
            <Typography variant='h6' align='center'>Identifique-se</Typography>

            <TextField
              fullWidth
              type='email'
              label='Login'
              value={email}
              disabled={isLoading}
              error={!!emailError}
              helperText={emailError}
              onKeyDown={() => setEmailError('')}
              onChange={e => setEmail(e.target.value)}
            />


            <TextField
              fullWidth
              label='Senha'
              type={showPassword ? 'text' : 'password'}
              value={password}
              disabled={isLoading}
              error={!!passwordError}
              helperText={passwordError}
              onKeyDown={() => setPasswordError('')}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

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
          </Box>
        </CardContent>
        <CardActions>

          <Box width='100%' display='flex' justifyContent='center'>

            <Button
              variant='contained'
              disabled={isLoading}
              onClick={handleSubmit}
              endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}
            >
              Entrar
            </Button>

          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};
