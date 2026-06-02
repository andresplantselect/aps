import AddIcon from '@mui/icons-material/Add';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import { Box, LinearProgress, Stack } from '@mui/material';
import React, { useState } from 'react';

import EmptyStateMessage from '@/src/components/common/EmptyStateMessage';
import { ProductsFilters } from '@/src/components/products/ProductsFilters';
import ProductsPage from '@/src/components/products/ProductsPage';
import ProductsViewToggle from '@/src/components/products/ProductsViewToggle';
import { useAuth } from '@/src/context/AuthContext';
import { useProductsState } from '@/src/hooks/useProductsState';
import { PrimaryButton } from '@/src/styledComponents';
import AdminProductFormView from '@/src/views/AdminProductFormView';

export default function ProductsTab() {
  const [showForm, setShowForm] = useState(false);

  const { isAdmin } = useAuth();
  const productsState = useProductsState();

  return (
    <Box>
      <Stack spacing={1}>
        {isAdmin && (
          <PrimaryButton
            onClick={() => setShowForm(true)}
            endIcon={<AddIcon />}
          >
            Añadir
          </PrimaryButton>
        )}

        <ProductsFilters {...productsState} />
        {isAdmin && <ProductsViewToggle {...productsState} />}

        {!productsState.isProductsLoading &&
          productsState.isProductListEmpty && (
            <EmptyStateMessage
              message="No hay productos disponibles"
              icon={<YardOutlinedIcon />}
            />
          )}

        {productsState.isProductsLoading ? (
          <LinearProgress />
        ) : (
          <ProductsPage {...productsState} />
        )}
      </Stack>

      {showForm && (
        <AdminProductFormView
          open={showForm}
          onClose={() => setShowForm(false)}
        />
      )}
    </Box>
  );
}
