import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TableCell } from '@mui/material';

import { SecondaryRoundIconButton } from '@/src/styledComponents';
import { ProductType } from '@/src/types/types';

export function ProductRowActions({
  product,
  onEdit,
  onDelete,
}: {
  product: ProductType;
  onEdit: (product: ProductType) => void;
  onDelete: (product: ProductType) => void;
}) {
  return (
    <>
      <TableCell align="center" sx={{ width: 64 }}>
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

      <TableCell align="center" sx={{ width: 64 }}>
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
    </>
  );
}
