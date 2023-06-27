import { AxiosError } from "axios"

// Função que atua como um interceptor de erro do Axios
export const errorInterceptor = (error: AxiosError) => {

    // Verifica se ocorreu um erro de conexão de rede
    if (error.message === 'Network Error'){
        // Retorna uma promessa rejeitada com um novo erro personalizado
        return Promise.reject(new Error('Erro de conexão'));
    }

    // Verifica se o status da resposta é 401 (Unauthorized)
    if (error.response?.status === 401){
        // Coloque aqui o código para lidar com a resposta de erro 401
        // ...
    }
    
    // Retorna uma promessa rejeitada com o erro original
    return Promise.reject(error);
}
