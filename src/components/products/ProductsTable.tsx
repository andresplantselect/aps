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

            <TableHeaderCell>Disponible</TableHeaderCell>

            <TableHeaderCell>Precio</TableHeaderCell>
            <TableHeaderCell>Disponible por Uds</TableHeaderCell>

            <TableHeaderCell>Uds × caja</TableHeaderCell>

            <TableHeaderCell>Maceta</TableHeaderCell>

            <TableHeaderCell>Altura</TableHeaderCell>
            {isAdmin && <TableHeaderCell>Visible en catálogo</TableHeaderCell>}

            {isAdmin && <TableHeaderCell>Editar</TableHeaderCell>}

            {isAdmin && <TableHeaderCell>Eliminar</TableHeaderCell>}
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
