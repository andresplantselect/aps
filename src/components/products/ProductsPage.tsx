import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import DeleteProductDialog from '@/src/components/products/DeleteProductDialog';
import ProductsGrid from '@/src/components/products/ProductsGrid';
import ProductsTable from '@/src/components/products/ProductsTable';
import { readProductFormDraft } from '@/src/helpers/productFormDraft';
import { UseProductsStateProps } from '@/src/types/propsTypes';
import { ProductType } from '@/src/types/types';
import AdminProductFormView from '@/src/views/AdminProductFormView';

export default function ProductsPage(
  productsState: UseProductsStateProps & { isCreateDialogOpen?: boolean },
) {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
  const [actionsState, setActionsState] = useState({
    edit: false,
    delete: false,
  });

  const { viewMode, visibleProducts, isCreateDialogOpen } = productsState;

  // Mobile browsers can kill a backgrounded tab while the native photo
  // picker is open, more likely the more the page has in memory. Unmount
  // the (image-heavy) grid/table while any product dialog is open to cut
  // that risk during the moment it actually matters.
  const isAnyProductDialogOpen =
    isCreateDialogOpen || (actionsState.edit && !!selectedProduct);

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
      {!isAnyProductDialogOpen && viewMode === 'cards' && (
        <ProductsGrid
          productsState={productsState}
          onDelete={(p) => handleUpdateTrigger(p, 'delete', true)}
          onEdit={(p) => handleUpdateTrigger(p, 'edit', true)}
        />
      )}

      {!isAnyProductDialogOpen && viewMode === 'table' && (
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
