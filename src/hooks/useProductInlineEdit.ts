import React, { useRef, useState } from 'react';

import { useAlert } from '@/src/context/AlertContext';
import { useProducts } from '@/src/context/ProductsContext';
import { productToForm } from '@/src/helpers/productToForm';
import { useUpdateProduct } from '@/src/hooks/api';
import { ProductInlineEditField, ProductType } from '@/src/types/types';

export function useProductInlineEdit(product: ProductType) {
  const { showAlert } = useAlert();
  const { updateProduct } = useUpdateProduct();
  const { updateProductInState } = useProducts();

  const [editingField, setEditingField] =
    useState<ProductInlineEditField>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = (field: ProductInlineEditField, currentValue: number) => {
    setEditingField(field);
    setEditValue(
      field === 'price'
        ? Number(currentValue).toFixed(2)
        : String(currentValue),
    );
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editingField) return;

    const parsed = parseFloat(editValue.replace(',', '.'));
    if (isNaN(parsed) || parsed < 0) {
      showAlert({ message: 'Valor inválido', severity: 'error' });
      cancelEdit();
      return;
    }

    const rounded =
      editingField === 'price'
        ? parseFloat(parsed.toFixed(2))
        : Math.round(parsed);

    setSaving(true);
    const form = { ...productToForm(product), [editingField]: rounded };
    const { error, data } = await updateProduct(form, product.id);
    setSaving(false);

    if (error) showAlert(error);
    else if (data) updateProductInState(data as unknown as ProductType);
    cancelEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Enter',
      'Escape',
      ',',
      '.',
    ];
    if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
    handleKeyDown(e);
  };

  return {
    editingField,
    editValue,
    setEditValue,
    saving,
    inputRef,
    startEdit,
    cancelEdit,
    saveEdit,
    handleNumberKeyDown,
  };
}
