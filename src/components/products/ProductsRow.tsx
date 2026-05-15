'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TableRow, TableCell } from '@mui/material';

import { useAuth } from '@/src/context/AuthContext';
import { SecondaryRoundIconButton } from '@/src/styledComponents';
import { ProductsRowProps } from '@/src/types/propsTypes';

export function ProductsRow({ product, onEdit, onDelete }: ProductsRowProps) {
  const { isAdmin } = useAuth();

  return (
    <TableRow hover>
      <TableCell sx={{ fontSize: 15 }}>{product.title}</TableCell>

      <TableCell
        align="center"
        sx={{
          color: product.available === 0 ? 'error.main' : 'inherit',
          fontWeight: product.available === 0 ? 600 : 400,
        }}
      >
        {product.available}
      </TableCell>

      <TableCell>€ {product.price}</TableCell>
      <TableCell align="center">
        {product.can_buy_units ? 'Si' : 'No'}
      </TableCell>

      <TableCell align="center">{product.units_per_box}</TableCell>

      <TableCell>{product.width ? `${product.width} cms` : '-'}</TableCell>

      <TableCell>{product.height ? `${product.height} cms` : '-'}</TableCell>

      {isAdmin && (
        <TableCell align="center">
          <SecondaryRoundIconButton
            onClick={() => onEdit(product)}
            sx={(theme) => ({
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,

              '&:hover': {
                borderColor: theme.palette.primary.dark,
                color: theme.palette.primary.dark,
              },
            })}
          >
            <EditIcon fontSize="small" />
          </SecondaryRoundIconButton>
        </TableCell>
      )}

      {isAdmin && (
        <TableCell align="center">
          <SecondaryRoundIconButton
            onClick={() => onDelete(product)}
            sx={(theme) => ({
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,

              '&:hover': {
                borderColor: theme.palette.error.dark,
                color: theme.palette.error.dark,
              },
            })}
          >
            <DeleteIcon fontSize="small" />
          </SecondaryRoundIconButton>
        </TableCell>
      )}
    </TableRow>
  );
}
