import { Switch, TableCell } from '@mui/material';

import { useProductFieldToggle } from '@/src/hooks/useProductFieldToggle';
import { ProductType } from '@/src/types/types';

export function ProductCanBuyUnitsCell({
  product,
  isAdmin,
}: {
  product: ProductType;
  isAdmin: boolean;
}) {
  const { toggle, saving } = useProductFieldToggle(product, 'can_buy_units');

  return (
    <TableCell align="center" sx={{ width: 64 }}>
      {isAdmin ? (
        <Switch
          checked={product.can_buy_units}
          onChange={toggle}
          disabled={saving}
        />
      ) : product.can_buy_units ? (
        'Si'
      ) : (
        'No'
      )}
    </TableCell>
  );
}
