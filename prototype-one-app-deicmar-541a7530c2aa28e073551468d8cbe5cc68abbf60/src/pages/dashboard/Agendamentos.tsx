import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { IListagemCidade, CidadesService } from '../../shared/services/api/cidades/CidadesService';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { Enviroment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';
import { useTheme } from '@mui/material/styles'; // Importe o useTheme
import { useDispatch } from 'react-redux';



export const ListagemDeCidades: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rows, setRows] = useState<IListagemCidade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const theme = useTheme(); // Obtenha o tema atual
  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);
  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      CidadesService.getAll(pagina, busca)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            console.log(result);

            setTotalCount(result.totalCount);
            setRows(result.data.map(item => ({ id: item.id, idagendamento: item.idagendamento, idoperador: item.idoperador })));
          }
        });
    });
  }, [busca, pagina]);
  

  const handleDelete = (id: number) => {
    setDeleteItemId(id);
    setIsDialogOpen(true);
  };

  const handleEdit = (idagendamento: string) => {
    dispatch({ type: 'SET_ID_AGENDAMENTO', payload: idagendamento }); // Adicione essa linha

     // Navegar para o path desejado
     navigate(`/cidades/detalhe/${idagendamento}`);
  };

  const handleConfirmDelete = (id: number) => {
    setIsDialogOpen(false);
  };

  return (
    <LayoutBaseDePagina
      titulo='Listagem Checklist'
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={100} sx={{
                background: theme.palette.mode !== 'dark'
                  ? 'linear-gradient(to right, #DDE2E5, #FDFBFB)'
                  : 'linear-gradient(to right, #282828, #434343)',
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
              }}>
                Ações
              </TableCell>
              <TableCell sx={{
                background: theme.palette.mode !== 'dark'
                  ? 'linear-gradient(to right, #DDE2E5, #FDFBFB)'
                  : 'linear-gradient(to right, #282828, #434343)',
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
              }}>
                ID Agendamento
              </TableCell>
              <TableCell sx={{
                background: theme.palette.mode !== 'dark'
                  ? 'linear-gradient(to right, #DDE2E5, #FDFBFB)'
                  : 'linear-gradient(to right, #282828, #434343)',
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
              }}>
                ID Operador
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell sx={{
                  background: theme.palette.mode !== 'dark'
                    ? 'linear-gradient(to right, #DDE2E5, #FDFBFB)'
                    : 'linear-gradient(to right, #282828, #434343)',
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                }}>
                  <IconButton size="small" onClick={() => handleEdit(row.idagendamento)}>
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
                <TableCell sx={{
                  background: theme.palette.mode !== 'dark'
                    ? 'linear-gradient(to right, #DDE2E5, #FDFBFB)'
                    : 'linear-gradient(to right, #282828, #434343)',
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                }}>
                  {row.idagendamento}
                </TableCell>
                <TableCell sx={{
                  background: theme.palette.mode !== 'dark'
                    ? 'linear-gradient(to right, #DDE2E5, #FDFBFB)'
                    : 'linear-gradient(to right, #282828, #434343)',
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                }}>
                  {row.idoperador}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {totalCount === 0 && !isLoading && (
            <caption>{Enviroment.LISTAGEM_VAZIA}</caption>
          )}

          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            )}
            {(totalCount > 0 && totalCount > Enviroment.LIMITE_DE_LINHAS) && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={pagina}
                    count={Math.ceil(totalCount / Enviroment.LIMITE_DE_LINHAS)}
                    onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() }, { replace: true })}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <p>Realmente deseja apagar?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
          <Button onClick={() => handleConfirmDelete(deleteItemId!)} color="error">Apagar</Button>
        </DialogActions>
      </Dialog>
    </LayoutBaseDePagina>
  );
};
