import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';

import { AuthService } from '../services/api/auth/AuthService';
import { Enviroment } from '../environment';
import jwt_decode from 'jwt-decode';

// Definindo a estrutura dos dados do contexto de autenticação
interface IAuthContextData {
  logout: () => void; // Função para fazer logout
  isAuthenticated: boolean; // Flag para indicar se o usuário está autenticado
  login: (email: string, password: string) => Promise<string | void>; // Função para fazer login
}

// Criando o contexto de autenticação
const AuthContext = createContext({} as IAuthContextData);

// Duração do cookie em dias
const COOKIE_EXPIRATION_DAYS = Enviroment.DIAS_EXPIRACAO;

// Chaves dos cookies
const COOKIE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';
const COOKIE_KEY__ID_OPERADOR = 'APP_ID_OPERADOR';
const COOKIE_KEY__MESSAGE = 'APP_MESSAGE';
const COOKIE_KEY__NOME_OPERADOR = 'APP_NOME_OPERADOR';
const COOKIE_KEY__GATE = 'APP_GATE';
const COOKIE_KEY__FIRST_ACCESS = 'APP_FIRST_ACCESS';

// Props do componente AuthProvider
interface IAuthProviderProps {
  children: React.ReactNode; // Conteúdo renderizado dentro do componente
}

// Componente AuthProvider
export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>(); // Token de acesso (inicialmente vazio)
  const [idOperador, setIdOperador] = useState<string>(); // ID do operador (inicialmente vazio)
  const [message, setMessage] = useState<string>(); // Mensagem (inicialmente vazia)
  const [nomeOperador, setNomeOperador] = useState<string>(); // Nome do operador (inicialmente vazio)

  // Verificar os cookies ao carregar a página
  useEffect(() => {
    const accessToken = Cookies.get(COOKIE_KEY__ACCESS_TOKEN);
    const idOperador = Cookies.get(COOKIE_KEY__ID_OPERADOR);
    const message = Cookies.get(COOKIE_KEY__MESSAGE);
    const nomeOperador = Cookies.get(COOKIE_KEY__NOME_OPERADOR);

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

  // // Função para fazer login
  // const handleLogin = useCallback(async (email: string, password: string) => {
  //   const result = await AuthService.auth(email, password);
  //   if (result instanceof Error) {
  //     return result.message; // Retorna a mensagem de erro
  //   } else {
  //     const expires = new Date();
  //     expires.setDate(expires.getDate() + COOKIE_EXPIRATION_DAYS);

  //     // Definindo os cookies com os dados da autenticação
  //     Cookies.set(COOKIE_KEY__ACCESS_TOKEN, result.acessToken, { expires });
  //     Cookies.set(COOKIE_KEY__ID_OPERADOR, result.idoperador, { expires });
  //     Cookies.set(COOKIE_KEY__MESSAGE, result.message, { expires });
  //     Cookies.set(COOKIE_KEY__NOME_OPERADOR, result.nomeoperador, { expires });
  //     Cookies.set(COOKIE_KEY__FIRST_ACCESS, result.first_access, { expires });

  //     // Atualizando os estados com os dados da autenticação
  //     setAccessToken(result.acessToken);
  //     setIdOperador(result.idoperador);
  //     setMessage(result.message);
  //     setNomeOperador(result.nomeoperador);
  //   }
  // }, []);



const handleLogin = useCallback(async (email: string, password: string) => {
  const result = await AuthService.auth(email, password);
  if (result instanceof Error) {
    return result.message; // Retorna a mensagem de erro
  } else {
    const expires = new Date();
    expires.setDate(expires.getDate() + COOKIE_EXPIRATION_DAYS);
    Cookies.set(COOKIE_KEY__MESSAGE, result.message, { expires });
     if (result.message === "Token invalido"){
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
    }
    if (result.acessToken){
    // Decodificar o JWT para obter os dados adicionais
    const decodedToken: any = jwt_decode(result.acessToken);

    // Verificar se o token foi decodificado com sucesso e contém os dados esperados
    if (decodedToken && typeof decodedToken === 'object') {
      const idOperador = decodedToken.cpf;
      const message = decodedToken.message;
      const nomeOperador = decodedToken.name;
      const firstAccess = decodedToken.first_access;

      // Definir os cookies com os dados da autenticação
      Cookies.set(COOKIE_KEY__ACCESS_TOKEN, result.acessToken, { expires });
      Cookies.set(COOKIE_KEY__ID_OPERADOR, idOperador, { expires });
      Cookies.set(COOKIE_KEY__MESSAGE, '', { expires });
      Cookies.set(COOKIE_KEY__NOME_OPERADOR, nomeOperador, { expires });
      Cookies.set(COOKIE_KEY__FIRST_ACCESS, firstAccess, { expires });

      // Atualizar os estados com os dados da autenticação
      setAccessToken(result.acessToken);
      setIdOperador(idOperador);
      setMessage(message);
      setNomeOperador(nomeOperador);
    }
    }else{

      handleLogout()
    }
  }

}, []);


  // Função para fazer logout
  const handleLogout = useCallback(() => {
    // Removendo os cookies e limpando os estados
    Cookies.remove(COOKIE_KEY__ACCESS_TOKEN);
    Cookies.remove(COOKIE_KEY__ID_OPERADOR);
    Cookies.remove(COOKIE_KEY__NOME_OPERADOR);
    Cookies.remove(COOKIE_KEY__GATE);
    Cookies.remove(COOKIE_KEY__FIRST_ACCESS);
    
    setAccessToken(undefined);
    setIdOperador(undefined);
    setMessage(undefined);
    setNomeOperador(undefined);
  }, []);

  // Verificar se o usuário está autenticado
  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

  // Se o usuário não estiver autenticado, remover o cookie de acesso
  if (isAuthenticated === false) {
    Cookies.remove(COOKIE_KEY__ACCESS_TOKEN);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}>
      {children} {/* Renderizando os componentes filhos */}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto de autenticação
export const useAuthContext = () => useContext(AuthContext);
