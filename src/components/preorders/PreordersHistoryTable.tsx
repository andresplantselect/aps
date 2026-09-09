'use client';

import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from '@mui/material';
import { isEmpty } from 'ramda';

import EmptyStateMessage from '@/src/components/common/EmptyStateMessage';
import { PreordersRow } from '@/src/components/preorders/PreordersRow';
import { useAuth } from '@/src/context/AuthContext';
import { usePreordersContext } from '@/src/context/PreordersContext';
import { TableHeaderCell } from '@/src/styledComponents';

export function PreordersHistoryTable() {
  const { sortedHistoryOrders } = usePreordersContext();
  const { isAdmin } = useAuth();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell sx={{ width: 48 }} />
            <TableHeaderCell align="center">ID</TableHeaderCell>

            {isAdmin && <TableHeaderCell>Usuario</TableHeaderCell>}

            <TableHeaderCell align="center">Estado</TableHeaderCell>
            <TableHeaderCell align="center">Estado de entrega</TableHeaderCell>

            <TableHeaderCell>Total</TableHeaderCell>
            <TableHeaderCell>Fecha</TableHeaderCell>
            <TableHeaderCell>Comentarios</TableHeaderCell>

            {isAdmin && (
              <TableHeaderCell align="center" sx={{ width: 140 }}>
                Aprobar
              </TableHeaderCell>
            )}
            {isAdmin && (
              <TableHeaderCell align="center" sx={{ width: 140 }}>
                Rechazar
              </TableHeaderCell>
            )}
            {isAdmin && (
              <TableHeaderCell align="center" sx={{ width: 140 }}>
                Entregado
              </TableHeaderCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty(sortedHistoryOrders) ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 11 : 8} align="center">
                <EmptyStateMessage
                  message="No hay pedidos en el historial"
                  icon={<TextSnippetOutlinedIcon />}
                />
              </TableCell>
            </TableRow>
          ) : (
            sortedHistoryOrders.map((order) => (
              <PreordersRow key={order.id} order={order} />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
