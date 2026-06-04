import { Box } from '@mui/material';

import ProductCard from '@/src/components/products/ProductCard';
import { ProductsGridProps } from '@/src/types/propsTypes';

export default function ProductsGrid({
  onDelete,
  onEdit,
  productsState,
}: ProductsGridProps) {
  const { visibleProducts } = productsState;

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
      <Box sx={{ width: '100%', maxWidth: 1400 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(302px, 1fr))',
            gap: { xs: '5px', sm: 2 },
          }}
        >
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={(p) => onDelete(p)}
              onEdit={(p) => onEdit(p)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
