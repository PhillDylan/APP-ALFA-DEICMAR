import { Enviroment } from '../../../environment';
import { Api } from '../data/DataService';
import Cookies from 'js-cookie';

export interface IListagemCidade {
  id: number;
  Agendamento?: string;
  Nome_Operador?: string;
  LACRE?: string;
  CNH_Motorista?: string;
  Nome_Motorista?: string;
  CPF_Motorista?: string;
  Serviço?: string;
  Placa_TRAS: string;
  Placa_FRENTE: string;
  date?: string;
}




export interface IDetalheCidade {
  id: number;
  idagendamento: string; // Adicione a propriedade 'nome' aqui
  idoperador: string; // Adicione a propriedade 'nome' aqui
  data?: any;
  date: string;
  hora: string;
  cnh: string;
  nomemotorista: string;
  nome: string
  service_name: string;
  trailer_vehicle: string;
  vehicle: string;
  idmotorista: string;
}



type TCidadesComTotalCount = {
  data: IDetalheCidade[];
  totalCount: number;
}

const COOKIE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';



// Codificando as credenciais para um token de autenticação
const Accesstoken = Cookies.get(COOKIE_KEY__ACCESS_TOKEN)

const urlRelativa = `/ultimosagendamentos`;

const config = {
  headers: {
    Authorization: "Bearer " + Accesstoken 
  }
};

const getAll = async (page = 1, filter = '', id = ''): Promise<TCidadesComTotalCount | Error> => {
  try {

    const accessToken = Cookies.get(COOKIE_KEY__ACCESS_TOKEN);

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };


    const { data, headers } = await Api.get(urlRelativa, config);

    if (data) {
      console.log(data)
      return {
        data: data.response, // Ajuste aqui para acessar o array de objetos 'response'
        totalCount: Number(headers['x-total-count'] || Enviroment.LIMITE_DE_LINHAS),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};


const getById = async (id: number): Promise<IDetalheCidade | Error> => {
  try {

    const accessToken = Cookies.get(COOKIE_KEY__ACCESS_TOKEN);

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };

    const { data } = await Api.get(urlRelativa,config);
    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetalheCidade, 'id'>): Promise<number | Error> => {
  try {

        const accessToken = Cookies.get(COOKIE_KEY__ACCESS_TOKEN);

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };

    const { data } = await Api.post<IDetalheCidade>(urlRelativa, dados);

    if (data) {

      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};



export const CidadesService = {
  getAll,
  create,
  getById,
};