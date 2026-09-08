'use client';

import { TableCell, TableRow } from '@mui/material';
import React from 'react';

import { ProductCanBuyUnitsCell } from '@/src/components/products/ProductCanBuyUnitsCell';
import { ProductRowActions } from '@/src/components/products/ProductRowActions';
import { ProductsInlineEditableCell } from '@/src/components/products/ProductsInlineEditableCell';
import { ProductVisibilityToggleCell } from '@/src/components/products/ProductVisibilityToggleCell';
import { EMPTY_VALUE } from '@/src/constants';
import { useAuth } from '@/src/context/AuthContext';
import { useProductInlineEdit } from '@/src/hooks/useProductInlineEdit';
import { ProductsRowProps } from '@/src/types/propsTypes';

export const ProductsRow = React.memo(function ProductsRow({
  product,
  onEdit,
  onDelete,
}: ProductsRowProps) {
  const { isAdmin } = useAuth();
  const edit = useProductInlineEdit(product);

  return (
    <TableRow hover>
      <TableCell
        sx={{
          maxWidth: 240,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={product.title}
      >
        {product.title}
      </TableCell>

      <TableCell
        sx={{
          color: product.available === 0 ? 'error.main' : 'inherit',
          fontWeight: product.available === 0 ? 600 : 400,
        }}
      >
        <ProductsInlineEditableCell
          field="available"
          value={product.available}
          suffix="Uds"
          isAdmin={isAdmin}
          edit={edit}
        />
      </TableCell>

      <TableCell>
        <ProductsInlineEditableCell
          field="price"
          value={product.price}
          prefix="€"
          isAdmin={isAdmin}
          edit={edit}
        />
      </TableCell>

      <ProductCanBuyUnitsCell product={product} isAdmin={isAdmin} />

      <TableCell align="center">{product.units_per_box}</TableCell>

      <TableCell align="center">
        {product.width ? `${product.width} cms` : EMPTY_VALUE}
      </TableCell>

      <TableCell align="center">
        {product.height ? `${product.height} cms` : EMPTY_VALUE}
      </TableCell>

      {isAdmin && <ProductVisibilityToggleCell product={product} />}

      {isAdmin && (
        <ProductRowActions
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </TableRow>
  );
});
