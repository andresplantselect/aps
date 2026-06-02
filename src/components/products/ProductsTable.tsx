'use client';

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TableSortLabel,
} from '@mui/material';

import { useAuth } from '@/src/context/AuthContext';
import { TableHeaderCell } from '@/src/styledComponents';
import { ProductsTableProps } from '@/src/types/propsTypes';

import { ProductsRow } from './ProductsRow';

export default function ProductsTable({
  productsState,
  onDelete,
  onEdit,
}: ProductsTableProps) {
  const { isAdmin } = useAuth();
  const { visibleProducts, sortBy, sortDir, toggleSort } = productsState;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              <TableSortLabel
                active={sortBy === 'title'}
                direction={sortDir}
                onClick={() => toggleSort('title')}
              >
                Artículo
              </TableSortLabel>
            </TableHeaderCell>

            <TableHeaderCell align="center">Disponible</TableHeaderCell>

            <TableHeaderCell>Precio</TableHeaderCell>
            <TableHeaderCell align="center">Disponible por Uds</TableHeaderCell>

            <TableHeaderCell align="center">Uds × caja</TableHeaderCell>

            <TableHeaderCell align="center">Maceta</TableHeaderCell>

            <TableHeaderCell align="center">Altura</TableHeaderCell>
            {isAdmin && <TableHeaderCell>Visible en catálogo</TableHeaderCell>}

            {isAdmin && (
              <TableHeaderCell align="center">Editar</TableHeaderCell>
            )}

            {isAdmin && (
              <TableHeaderCell align="center">Eliminar</TableHeaderCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {visibleProducts.map((product) => (
            <ProductsRow
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
