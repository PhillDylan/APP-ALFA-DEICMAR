import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';

import { AuthService } from '../services/api/auth/AuthService';
import { Enviroment } from '../environment';

interface IAuthContextData {
  logout: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | void>;
}

const AuthContext = createContext({} as IAuthContextData);

const COOKIE_EXPIRATION_DAYS = Enviroment.DIAS_EXPIRACAO; // Expiração de 1 dia em dias

const COOKIE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';
const COOKIE_KEY__ID_OPERADOR = 'APP_ID_OPERADOR';
const COOKIE_KEY__MESSAGE = 'APP_MESSAGE';
const COOKIE_KEY__NOME_OPERADOR = 'APP_NOME_OPERADOR';
const COOKIE_KEY__GATE = 'APP_GATE';
const COOKIE_KEY__FIRST_ACCESS = 'APP_FIRST_ACCESS';

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>();
  const [idOperador, setIdOperador] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [nomeOperador, setNomeOperador] = useState<string>();

  useEffect(() => {
    const accessToken = Cookies.get(COOKIE_KEY__ACCESS_TOKEN);
    const idOperador = Cookies.get(COOKIE_KEY__ID_OPERADOR);
    const message = Cookies.get(COOKIE_KEY__MESSAGE);
    const nomeOperador = Cookies.get(COOKIE_KEY__NOME_OPERADOR);
    const firstAccess = Cookies.get(COOKIE_KEY__FIRST_ACCESS);

    if (accessToken) {
      setAccessToken(accessToken);
    }
    if (idOperador) {
      setIdOperador(idOperador);
    }
    if (message) {
      setMessage(message);
    }
    if (nomeOperador) {
      setNomeOperador(nomeOperador);
    }
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await AuthService.auth(email, password);
    if (result instanceof Error) {
      return result.message;
    } else {
      const expires = new Date();
      expires.setDate(expires.getDate() + COOKIE_EXPIRATION_DAYS);

      Cookies.set(COOKIE_KEY__ACCESS_TOKEN, result.accessToken, { expires });
      Cookies.set(COOKIE_KEY__ID_OPERADOR, result.idoperador, { expires });
      Cookies.set(COOKIE_KEY__MESSAGE, result.message, { expires });
      Cookies.set(COOKIE_KEY__NOME_OPERADOR, result.nomeoperador, { expires });
      Cookies.set(COOKIE_KEY__FIRST_ACCESS, result.first_access, { expires });

      setAccessToken(result.accessToken);
      setIdOperador(result.idoperador);
      setMessage(result.message);
      setNomeOperador(result.nomeoperador);
    }
  }, []);

  const handleLogout = useCallback(() => {
    Cookies.remove(COOKIE_KEY__ACCESS_TOKEN);
    Cookies.remove(COOKIE_KEY__ID_OPERADOR);
    Cookies.remove(COOKIE_KEY__MESSAGE);
    Cookies.remove(COOKIE_KEY__NOME_OPERADOR);
    Cookies.remove(COOKIE_KEY__GATE);
    Cookies.remove(COOKIE_KEY__FIRST_ACCESS);
    

    setAccessToken(undefined);
    setIdOperador(undefined);
    setMessage(undefined);
    setNomeOperador(undefined);
  }, []);

  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);
  if (isAuthenticated === false) {
    Cookies.remove(COOKIE_KEY__ACCESS_TOKEN);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
