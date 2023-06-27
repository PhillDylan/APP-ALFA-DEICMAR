import axios from 'axios';

import { responseInterceptor, errorInterceptor } from './interceptors';
import { Enviroment } from '../../../environment';

// Obtendo as credenciais do ambiente
const username = Enviroment.USERNAME;
const password = Enviroment.PASSWORD;

// Codificando as credenciais para um token de autenticação
const token = btoa(`${username}:${password}`);

// Criando uma instância do Axios para realizar as chamadas à API
const Api = axios.create({
  baseURL: Enviroment.URL_BASE,
  headers: {
    Authorization: "Basic " + token 
  }
});

// Adicionando interceptors para manipulação das respostas e erros
Api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error),
);

// Exportando a instância do Axios configurada como um módulo
export { Api };
