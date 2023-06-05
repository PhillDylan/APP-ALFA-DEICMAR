import { Enviroment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemCidade {
  id: number;
  idagendamento: string;
  idoperador?: string;
}




export interface IDetalheCidade {
  id: number;
  idagendamento: string; // Adicione a propriedade 'nome' aqui
  idoperador: string; // Adicione a propriedade 'nome' aqui
  data: {
    data: string;
    hora: string;
    numerodolacre: string;
    tipo_lacre: string;
  };
}



type TCidadesComTotalCount = {
  data: IDetalheCidade[];
  totalCount: number;
}


const getAll = async (page = 1, filter = '', id = ''): Promise<TCidadesComTotalCount | Error> => {
  try {
    const urlRelativa = `/ultimosagendamentos`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
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
    const { data } = await Api.get(`/ultimosagendamentos`);
    console.log('data',data);
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
    const { data } = await Api.post<IDetalheCidade>('/ultimosagendamentos', dados);

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