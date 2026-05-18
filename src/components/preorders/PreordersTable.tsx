'use client';

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Paper,
  TableSortLabel,
} from '@mui/material';

import { useAuth } from '@/src/context/AuthContext';
import { usePreordersContext } from '@/src/context/PreordersContext';
import { TableHeaderCell } from '@/src/styledComponents';

import { PreordersRow } from './PreordersRow';

export function PreordersTable() {
  const {
    paginated: orders,
    sortBy,
    sortDir,
    toggleSort,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    sortedOrders,
  } = usePreordersContext();
  const { isAdmin } = useAuth();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell />
            <TableHeaderCell>ID</TableHeaderCell>

            {isAdmin && <TableHeaderCell>Usuario</TableHeaderCell>}

            <TableHeaderCell align="center">Estado</TableHeaderCell>
            <TableHeaderCell align="center">Estado de entrega</TableHeaderCell>

            <TableHeaderCell>Total</TableHeaderCell>

            <TableHeaderCell>
              <TableSortLabel
                active={sortBy === 'date'}
                direction={sortDir}
                onClick={() => toggleSort('date')}
              >
                Fecha
              </TableSortLabel>
            </TableHeaderCell>

            <TableHeaderCell>Comentarios</TableHeaderCell>

            {isAdmin && (
              <TableHeaderCell align="center">Aprobar</TableHeaderCell>
            )}
            {isAdmin && (
              <TableHeaderCell align="center">Rechazar</TableHeaderCell>
            )}
            {isAdmin && (
              <TableHeaderCell align="center">Entregado</TableHeaderCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableHeaderCell colSpan={isAdmin ? 9 : 6} align="center">
                No hay pedidos todavía
              </TableHeaderCell>
            </TableRow>
          ) : (
            orders.map((order) => <PreordersRow key={order.id} order={order} />)
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={sortedOrders.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPageOptions={[5, 10, 20]}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </TableContainer>
  );
}
