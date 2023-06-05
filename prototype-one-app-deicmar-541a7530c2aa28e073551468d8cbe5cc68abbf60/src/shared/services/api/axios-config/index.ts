import axios from 'axios';

import { responseInterceptor, errorInterceptor } from './interceptors';
import { Enviroment } from '../../../environment';

const username = "admin";
const password = "speed12345";
const token = btoa(`${username}:${password}`);

const Api = axios.create({
  baseURL: Enviroment.URL_BASE,
  headers: {
    Authorization: "Basic " + token 
  }
});

Api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error),
);

export { Api };
