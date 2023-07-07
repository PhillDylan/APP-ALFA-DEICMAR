import { AxiosError } from "axios"

import Cookies from 'js-cookie';


const COOKIE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';

// Codificando as credenciais para um token de autenticação
const Accesstoken = Cookies.get(COOKIE_KEY__ACCESS_TOKEN)

// Função que atua como um interceptor de erro do Axios
export const errorInterceptor = (error: AxiosError) => {

    // Verifica se ocorreu um erro de conexão de rede
    if (error.message === 'Network Error'){
        // Retorna uma promessa rejeitada com um novo erro personalizado
        return Promise.reject(new Error('Erro de conexão'));
    }

    // Verifica se ocorreu um erro de conexão de rede
    if (error.message === 'Request failed with status code 400'){
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
        window.location.reload(); // Recarrega a página
    }

    // Verifica se o status da resposta é 401 (Unauthorized)
    if (error.response?.status === 401){
        // Coloque aqui o código para lidar com a resposta de erro 401
        // ...
    }
    
    // Retorna uma promessa rejeitada com o erro original
    return ;
}
