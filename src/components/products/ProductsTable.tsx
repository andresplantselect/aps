"use client";

import { useAuth } from "@/src/context/AuthContext.tsx";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TableSortLabel,
} from "@mui/material";

import { TableHeaderCell } from "@/src/styledComponents";
import { ProductsTableProps } from "@/src/types/propsTypes";

import { ProductsRow } from "./ProductsRow";

export default function ProductsTable({
  products,
  sortBy,
  sortDir,
  toggleSort,
  onDelete,
  onEdit,
}: ProductsTableProps) {
  const { isAdmin } = useAuth();
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              <TableSortLabel
                active={sortBy === "title"}
                direction={sortDir}
                onClick={() => toggleSort("title")}
              >
                Artículo
              </TableSortLabel>
            </TableHeaderCell>

            <TableHeaderCell align="center">Disponible</TableHeaderCell>

            <TableHeaderCell>Precio</TableHeaderCell>
            <TableHeaderCell align="center">Disponible por Uds</TableHeaderCell>

            <TableHeaderCell align="center">Uds × caja</TableHeaderCell>

            <TableHeaderCell>Maceta</TableHeaderCell>

            <TableHeaderCell>Altura</TableHeaderCell>

            {isAdmin && (
              <TableHeaderCell align="center">Editar</TableHeaderCell>
            )}

            {isAdmin && (
              <TableHeaderCell align="center">Eliminar</TableHeaderCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product) => (
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
