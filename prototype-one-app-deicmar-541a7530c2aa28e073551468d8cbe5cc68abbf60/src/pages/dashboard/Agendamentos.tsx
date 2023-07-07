import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { IListagemCidade, CidadesService } from '../../shared/services/api/cidades/CidadesService';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { Enviroment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';
import { useTheme } from '@mui/material/styles';
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
  const [showTable, setShowTable] = useState(true); // Estado para controlar qual componente renderizar
  const [selectedRow, setSelectedRow] = useState<IListagemCidade | null>(null); // Estado para armazenar a linha selecionada
  const theme = useTheme();

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina: any = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);

  const cellStyle = {
    background: theme.palette.mode !== 'dark'
      ? 'linear-gradient(to right, #DDE2E5, #FDFBFB)'
      : 'linear-gradient(to right, #282828, #434343)',
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
  };

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      CidadesService.getAll(pagina, busca)
        .then((result) => {
          setIsLoading(false);
          
          if (result instanceof Error) {
          } else {
            setTotalCount(result.totalCount);
            setRows(result.data.map(item => ({
              date: ` ${item.date.split("T")[0]} / ${item.hora.split(":")[0]}:${item.hora.split(":")[1]}:${item.hora.split(":")[2].split(".")[0]} ` || '',
              id: item.id,
              Agendamento: item.idagendamento || '',
              Nome_Operador: item.nome || '',
              LACRE: item.data?.join(', ') || '',
              CNH_Motorista: item.cnh || '',
              Nome_Motorista: item.nomemotorista || '',
              CPF_Motorista: item.idmotorista || '',
              Serviço: item.service_name || '',
              Placa_TRAS: item.trailer_vehicle || '',
              Placa_FRENTE: item.vehicle || '',
            })));
          }
        });
    });
  }, [busca, pagina]);

  const handleDelete = (id: number) => {
    setDeleteItemId(id);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: IListagemCidade) => {
    setSelectedRow(item);
    setShowTable(false);
  };

  const handleConfirmDelete = (id: number) => {
    setIsDialogOpen(false);
  };

  const handleBack = () => {
    setShowTable(true);
    setSelectedRow(null);
  };

  if (!showTable && selectedRow) {
    // Renderizar o componente com as informações da linha selecionada
    return (
      <LayoutBaseDePagina titulo='Detalhes'>
        <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
          <Table sx={{ textTransform: 'uppercase' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={cellStyle}>Propriedade</TableCell>
                <TableCell sx={cellStyle}>Informação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(selectedRow).map(([key, value]) => {
                // Ignorar a propriedade 'id'
                if (key === 'id') return null;
  
                return (
                  <TableRow key={key}>
                    <TableCell sx={cellStyle}>{key.replace(/_/g, ' ')}</TableCell>
                    <TableCell sx={cellStyle}>{value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid sx={{ m: 1, width: 'auto', textAlign: 'center' }}>
          <Button sx={{ m: 1, border: '10px' }} variant="contained" onClick={handleBack}>Voltar</Button>
        </Grid>
      </LayoutBaseDePagina>
    );
  }

  return (
    <LayoutBaseDePagina titulo='Listagem Checklist'>
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table  sx={{ textTransform: 'uppercase' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={cellStyle}>
                INFO
              </TableCell>
              <TableCell sx={cellStyle}>
                Placa FRENTE
              </TableCell>
              <TableCell sx={cellStyle}>
                Placa TRAS
              </TableCell>
              <TableCell sx={cellStyle}>
                Data
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell sx={cellStyle}>
                  <IconButton size="small" onClick={() => handleEdit(row)}>
                    <Icon>assignment</Icon>
                  </IconButton>
                </TableCell>
                <TableCell sx={cellStyle}>
                  {row.Placa_FRENTE}
                </TableCell>
                <TableCell sx={cellStyle}>
                 {row.Placa_TRAS}
                </TableCell>
                <TableCell sx={cellStyle}>
                 {row.date}
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
