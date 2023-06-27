import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Definindo a estrutura dos dados de cada opção do Drawer
interface IDrawerOption {
    icon: string; // Ícone da opção
    path: string; // Caminho da opção
    label: string; // Rótulo da opção
}

// Definindo a estrutura dos dados do contexto do Drawer
interface IDrawerContextData {
    isDrawerOpen: boolean; // Flag para indicar se o Drawer está aberto ou fechado
    toggleDrawerOpen: () => void; // Função para alternar entre aberto e fechado
    drawerOptions: IDrawerOption[]; // Opções do Drawer
    setDrawerOptions: (newDrawerOptions: IDrawerOption[]) => void; // Função para atualizar as opções do Drawer
}

// Criando o contexto do Drawer
const DrawerContext = createContext({} as IDrawerContextData);

// Hook para acessar o contexto do Drawer
export const useAppDrawerContext = () => {
    return useContext(DrawerContext);
}

// Props do componente AppDrawerProvider
interface IAppDrawerProvider{
    children : React.ReactNode; // Conteúdo renderizado dentro do componente
}

// Componente AppDrawerProvider
export const AppDrawerProvider: React.FC<IAppDrawerProvider> = ({ children }) => {
    const [drawerOptions, setDrawerOptions] = useState<IDrawerOption[]>([]); // Estado das opções do Drawer (inicialmente vazio)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Estado para indicar se o Drawer está aberto (inicialmente fechado)

    // Função para alternar entre aberto e fechado
    const toggleDrawerOpen = useCallback(() => {
        setIsDrawerOpen(oldDrawerOpen => !oldDrawerOpen);
    }, [])

    // Função para atualizar as opções do Drawer
    const handleSetDrawerOptions = useCallback((newDrawerOptions: IDrawerOption[]) => {
        setDrawerOptions(newDrawerOptions);
    }, [])

    return (
        <DrawerContext.Provider value={{ isDrawerOpen, drawerOptions, toggleDrawerOpen, setDrawerOptions: handleSetDrawerOptions }}>
            {children} {/* Renderizando os componentes filhos */}
        </DrawerContext.Provider>
    )
}
