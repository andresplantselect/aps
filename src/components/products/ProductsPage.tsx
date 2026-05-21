import { Box } from '@mui/material';
import React, { useState } from 'react';

import DeleteProductDialog from '@/src/components/products/DeleteProductDialog';
import ProductsGrid from '@/src/components/products/ProductsGrid';
import ProductsTable from '@/src/components/products/ProductsTable';
import { UseProductsStateProps } from '@/src/types/propsTypes';
import { ProductType } from '@/src/types/types';
import AdminProductFormView from '@/src/views/AdminProductFormView';

export default function ProductsPage(productsState: UseProductsStateProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
  const [actionsState, setActionsState] = useState({
    edit: false,
    delete: false,
  });

  const { viewMode } = productsState;

  const handleUpdateTrigger = (
    p: ProductType | null,
    dialog: keyof typeof actionsState,
    dialogState: boolean,
  ) => {
    setSelectedProduct(p);
    setActionsState((prev) => ({ ...prev, [dialog]: dialogState }));
  };

  return (
    <Box>
      {viewMode === 'cards' && (
        <ProductsGrid
          productsState={productsState}
          onDelete={(p) => handleUpdateTrigger(p, 'delete', true)}
          onEdit={(p) => handleUpdateTrigger(p, 'edit', true)}
        />
      )}

      {viewMode === 'table' && (
        <ProductsTable
          productsState={productsState}
          onDelete={(p) => handleUpdateTrigger(p, 'delete', true)}
          onEdit={(p) => handleUpdateTrigger(p, 'edit', true)}
        />
      )}

      {actionsState.delete && selectedProduct && (
        <DeleteProductDialog
          product={selectedProduct}
          open={actionsState.delete}
          onClose={() => handleUpdateTrigger(null, 'delete', false)}
        />
      )}

      {actionsState.edit && selectedProduct && (
        <AdminProductFormView
          open={actionsState.edit}
          onClose={() => handleUpdateTrigger(null, 'edit', false)}
          product={selectedProduct}
        />
      )}
    </Box>
  );
}
