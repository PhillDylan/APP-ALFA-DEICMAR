import { createStore } from 'redux';

// Defina o estado inicial
interface AppState {
  listaItens: { lacre: string; imagem: Buffer }[];
  mensagemFetch: boolean | null;
  dadosFetch: any;
  idAgendamento: string | null; // Adicione essa propriedade
}


const initialState: AppState = {
  listaItens: [],
  mensagemFetch: false,
  dadosFetch: null, // Adicione essa linha com um valor inicial apropriado
  idAgendamento: null, // Adicione essa propriedade
};


// Defina as ações
const SET_LISTA_ITENS = 'SET_LISTA_ITENS';

interface SetListaItensAction {
  type: typeof SET_LISTA_ITENS;
  payload: { lacre: string; imagem: Buffer }[];
}

const SET_MENSAGEM_FETCH = 'SET_MENSAGEM_FETCH';

interface SetMensagemFetchAction {
  type: typeof SET_MENSAGEM_FETCH;
  payload: boolean;
}


const SET_DADOS_FETCH = 'SET_DADOS_FETCH';

interface SetDadosFetchAction {
  type: typeof SET_DADOS_FETCH;
  payload: any; // Substitua "any" pelo tipo correto dos dados retornados
}

const SET_ID_AGENDAMENTO = 'SET_ID_AGENDAMENTO';

interface SetIdAgendamentoAction {
  type: typeof SET_ID_AGENDAMENTO;
  payload: string;
}

// Dentro do bloco de definição de AppActionTypes
type AppActionTypes = SetListaItensAction | SetMensagemFetchAction | SetDadosFetchAction | SetIdAgendamentoAction;


// Defina o reducer
const reducer = (state: AppState = initialState, action: AppActionTypes): AppState => {
  switch (action.type) {
    case SET_LISTA_ITENS:
      return {
        ...state,
        listaItens: action.payload,
      };
    case SET_DADOS_FETCH:
      return {
        ...state,
        dadosFetch: action.payload,
      };
    case SET_MENSAGEM_FETCH:
      return {
        ...state,
        mensagemFetch: action.payload,
      };
    case SET_ID_AGENDAMENTO:
      return {
        ...state,
        idAgendamento: action.payload,
      };
    default:
      return state;
  }
};


// Crie a store
const store = createStore(reducer);

export default store;

export type RootState = ReturnType<typeof store.getState>;
