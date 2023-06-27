import { AxiosResponse } from "axios"

// Função que atua como um interceptor de resposta do Axios
export const responseInterceptor = (response: AxiosResponse) => {
    // Retorna a resposta original sem fazer nenhuma modificação
    return response;
}
