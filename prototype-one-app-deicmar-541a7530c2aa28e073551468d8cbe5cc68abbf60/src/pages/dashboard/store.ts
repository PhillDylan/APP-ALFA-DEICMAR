import { createStore } from 'redux';

// Defina o estado inicial
interface AppState {
  listaItens: { lacre: string; imagem: Buffer }[]; // Array de objetos com propriedades 'lacre' e 'imagem'
  mensagemFetch: boolean | null; // Booleano ou nulo
  dadosFetch: any; // Qualquer tipo de dados (substitua por um tipo adequado)
  dadosFetchUpdate: any; // Qualquer tipo de dados (substitua por um tipo adequado)
  idAgendamento: string | null; // Adicione essa propriedade que pode ser uma string ou nulo
}

const initialState: AppState = {
  listaItens: [], // Array vazio
  mensagemFetch: false, // Valor booleano
  dadosFetch: null, // Valor nulo (substitua por um valor inicial apropriado)
  dadosFetchUpdate: null, // Valor nulo (substitua por um valor inicial apropriado)
  idAgendamento: null, // Valor nulo para a propriedade idAgendamento
};

// Defina as ações
const SET_LISTA_ITENS = 'SET_LISTA_ITENS';

interface SetListaItensAction {
  type: typeof SET_LISTA_ITENS;
  payload: { lacre: string; imagem: Buffer }[]; // Array de objetos com propriedades 'lacre' e 'imagem'
}

const SET_MENSAGEM_FETCH = 'SET_MENSAGEM_FETCH';

interface SetMensagemFetchAction {
  type: typeof SET_MENSAGEM_FETCH;
  payload: boolean; // Valor booleano
}

const SET_DADOS_FETCH = 'SET_DADOS_FETCH';

interface SetDadosFetchAction {
  type: typeof SET_DADOS_FETCH;
  payload: any; // Substitua "any" pelo tipo correto dos dados retornados
}

const SET_DADOS_FETCH_UPDATE = 'SET_DADOS_FETCH_UPDATE';

interface SetDadosFetchUpdateAction {
  type: typeof SET_DADOS_FETCH_UPDATE;
  payload: any; // Substitua "any" pelo tipo correto dos dados retornados
}

const SET_ID_AGENDAMENTO = 'SET_ID_AGENDAMENTO';

interface SetIdAgendamentoAction {
  type: typeof SET_ID_AGENDAMENTO;
  payload: string; // Valor string
}

// Dentro do bloco de definição de AppActionTypes
type AppActionTypes =
  | SetListaItensAction
  | SetMensagemFetchAction
  | SetDadosFetchAction
  | SetIdAgendamentoAction
  | SetDadosFetchUpdateAction;

// Defina o reducer
const reducer = (state: AppState = initialState, action: AppActionTypes): AppState => {
  switch (action.type) {
    case SET_LISTA_ITENS:
      return {
        ...state,
        listaItens: action.payload, // Atualiza a propriedade listaItens com o valor do payload da ação
      };
    case SET_DADOS_FETCH:
      return {
        ...state,
        dadosFetch: action.payload, // Atualiza a propriedade dadosFetch com o valor do payload da ação
      };
    case SET_DADOS_FETCH_UPDATE:
      return {
        ...state,
        dadosFetchUpdate: action.payload, // Atualiza a propriedade dadosFetchUpdate com o valor do payload da ação
      };
    case SET_MENSAGEM_FETCH:
      return {
        ...state,
        mensagemFetch: action.payload, // Atualiza a propriedade mensagemFetch com o valor do payload da ação
      };
    case SET_ID_AGENDAMENTO:
      return {
        ...state,
        idAgendamento: action.payload, // Atualiza a propriedade idAgendamento com o valor do payload da ação
      };
    default:
      return state; // Retorna o estado sem modificação se a ação não for reconhecida
  }
};

// Crie a store
const store = createStore(reducer);

export default store;

export type RootState = ReturnType<typeof store.getState>;
