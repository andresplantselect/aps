import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { CircularProgress, TableCell, Tooltip } from '@mui/material';

import { useProductFieldToggle } from '@/src/hooks/useProductFieldToggle';
import { SecondaryRoundIconButton } from '@/src/styledComponents';
import { ProductType } from '@/src/types/types';

export function ProductVisibilityToggleCell({
  product,
}: {
  product: ProductType;
}) {
  const { toggle, saving } = useProductFieldToggle(product, 'is_visible');

  return (
    <TableCell align="center" sx={{ width: 64 }}>
      {saving ? (
        <CircularProgress size={20} />
      ) : (
        <Tooltip title={product.is_visible ? 'Click to hide' : 'Click to show'}>
          <SecondaryRoundIconButton onClick={toggle}>
            {product.is_visible ? (
              <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
            ) : (
              <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} />
            )}
          </SecondaryRoundIconButton>
        </Tooltip>
      )}
    </TableCell>
  );
}
