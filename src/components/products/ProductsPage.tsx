import { Box } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import DeleteProductDialog from '@/src/components/products/DeleteProductDialog';
import ProductsGrid from '@/src/components/products/ProductsGrid';
import ProductsTable from '@/src/components/products/ProductsTable';
import { readProductFormDraft } from '@/src/helpers/productFormDraft';
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

  const { viewMode, visibleProducts } = productsState;

  // Reopen the "edit product" dialog if a mobile reload (see
  // productFormDraft.ts) left an edit-mode draft behind.
  const hasRestoredDraft = useRef(false);
  useEffect(() => {
    if (hasRestoredDraft.current) return;

    const draft = readProductFormDraft();
    if (draft?.mode !== 'edit' || !draft.productId) return;

    const match = visibleProducts.find((p) => p.id === draft.productId);
    if (!match) return;

    hasRestoredDraft.current = true;
    setSelectedProduct(match);
    setActionsState((prev) => ({ ...prev, edit: true }));
  }, [visibleProducts]);

  const handleUpdateTrigger = useCallback(
    (
      p: ProductType | null,
      dialog: keyof typeof actionsState,
      dialogState: boolean,
    ) => {
      setSelectedProduct(p);
      setActionsState((prev) => ({ ...prev, [dialog]: dialogState }));
    },
    [],
  );

  const handleEdit = useCallback(
    (p: ProductType) => handleUpdateTrigger(p, 'edit', true),
    [handleUpdateTrigger],
  );

  const handleDelete = useCallback(
    (p: ProductType) => handleUpdateTrigger(p, 'delete', true),
    [handleUpdateTrigger],
  );

  return (
    <Box>
      {viewMode === 'cards' && (
        <ProductsGrid
          productsState={productsState}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      {viewMode === 'table' && (
        <ProductsTable
          productsState={productsState}
          onDelete={handleDelete}
          onEdit={handleEdit}
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
