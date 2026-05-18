import AddIcon from '@mui/icons-material/Add';
import { Box, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

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
      <Stack spacing={2}>
        {isAdmin && (
          <PrimaryButton
            onClick={() => setShowForm(true)}
            endIcon={<AddIcon />}
          >
            Añadir
          </PrimaryButton>
        )}

        <ProductsFilters {...productsState} />
        <ProductsViewToggle {...productsState} />

        {productsState.isProductListEmpty && (
          <Typography textAlign="center" color="text.secondary">
            No hay productos disponibles.
          </Typography>
        )}

        <ProductsPage {...productsState} />
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
