import axios from 'axios';

import Cookies from 'js-cookie';

import { responseInterceptor, errorInterceptor } from '../axios-config/interceptors';
import { Enviroment } from '../../../environment';

const COOKIE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';



// Codificando as credenciais para um token de autenticação
const Accesstoken = Cookies.get(COOKIE_KEY__ACCESS_TOKEN)

// Criando uma instância do Axios para realizar as chamadas à API
const Api = axios.create({
  baseURL: Enviroment.URL_BASE,
  headers: {
    Authorization: "Bearer " + Accesstoken 
  }
});

// Adicionando interceptors para manipulação das respostas e erros
Api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error),
);

// Exportando a instância do Axios configurada como um módulo
export { Api };