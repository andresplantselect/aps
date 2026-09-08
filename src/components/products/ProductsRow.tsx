'use client';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  TableRow,
  TableCell,
  TextField,
  IconButton,
  Stack,
  CircularProgress,
  Tooltip,
  Switch,
} from '@mui/material';
import React, { useState, useRef } from 'react';

import { EMPTY_VALUE } from '@/src/constants';
import { useAlert } from '@/src/context/AlertContext';
import { useAuth } from '@/src/context/AuthContext';
import { useProducts } from '@/src/context/ProductsContext';
import { useUpdateProduct } from '@/src/hooks/api';
import { SecondaryRoundIconButton } from '@/src/styledComponents';
import { ProductForm } from '@/src/types/propsTypes';
import { ProductsRowProps } from '@/src/types/propsTypes';
import { ProductType } from '@/src/types/types';

function productToForm(product: ProductType): ProductForm {
  return {
    title: product.title,
    price: product.price,
    comment: product.comment ?? '',
    units_per_box: product.units_per_box,
    images: product.images ?? [],
    available: product.available,
    height: product.height ?? '',
    width: product.width ?? '',
    can_buy_units: product.can_buy_units,
    is_visible: product.is_visible,
  };
}

type InlineField = 'available' | 'price' | null;

export function ProductsRow({ product, onEdit, onDelete }: ProductsRowProps) {
  const { isAdmin } = useAuth();
  const { showAlert } = useAlert();
  const { updateProduct } = useUpdateProduct();
  const { updateProductInState } = useProducts();

  const [editingField, setEditingField] = useState<InlineField>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = (field: InlineField, currentValue: number) => {
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

  const toggleVisibility = async () => {
    setSaving(true);
    const form = { ...productToForm(product), is_visible: !product.is_visible };
    const { error, data } = await updateProduct(form, product.id);
    setSaving(false);
    if (error) showAlert(error);
    else if (data) updateProductInState(data as unknown as ProductType);
  };

  const toggleCanBuyUnits = async () => {
    setSaving(true);
    const form = {
      ...productToForm(product),
      can_buy_units: !product.can_buy_units,
    };
    const { error, data } = await updateProduct(form, product.id);
    setSaving(false);
    if (error) showAlert(error);
    else if (data) updateProductInState(data as unknown as ProductType);
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

  const renderInlineCell = (
    field: 'available' | 'price',
    value: number,
    prefix?: string,
  ) => {
    if (!isAdmin) {
      return (
        <>
          {prefix ? `${prefix} ` : ''}
          {field === 'price' ? Number(value).toFixed(2) : value}
        </>
      );
    }

    const displayValue = field === 'price' ? Number(value).toFixed(2) : value;

    if (editingField === field) {
      return (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <TextField
            inputRef={inputRef}
            size="small"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleNumberKeyDown}
            onBlur={saveEdit}
            sx={{ width: 80 }}
            inputProps={{
              style: { padding: '4px 8px', fontSize: 14 },
              inputMode: 'decimal',
            }}
            autoFocus
          />
          <IconButton
            size="small"
            onMouseDown={(e) => {
              e.preventDefault();
              saveEdit();
            }}
          >
            <CheckIcon fontSize="small" color="success" />
          </IconButton>
          <IconButton
            size="small"
            onMouseDown={(e) => {
              e.preventDefault();
              cancelEdit();
            }}
          >
            <CloseIcon fontSize="small" color="error" />
          </IconButton>
        </Stack>
      );
    }

    return (
      <Tooltip title="Click to edit" placement="top">
        <span
          onClick={() => startEdit(field, value)}
          style={{ cursor: 'pointer', borderBottom: '1px dashed currentColor' }}
        >
          {prefix ? `${prefix} ` : ''}
          {displayValue}
        </span>
      </Tooltip>
    );
  };

  return (
    <TableRow hover>
      <TableCell sx={{ fontSize: 15 }}>{product.title}</TableCell>

      <TableCell
        align="center"
        sx={{
          color: product.available === 0 ? 'error.main' : 'inherit',
          fontWeight: product.available === 0 ? 600 : 400,
        }}
      >
        {renderInlineCell('available', product.available)}
      </TableCell>

      <TableCell>{renderInlineCell('price', product.price, '€')}</TableCell>

      <TableCell align="center">
        {isAdmin ? (
          <Switch
            checked={product.can_buy_units}
            onChange={toggleCanBuyUnits}
            disabled={saving}
            size="small"
          />
        ) : product.can_buy_units ? (
          'Si'
        ) : (
          'No'
        )}
      </TableCell>

      <TableCell align="center">{product.units_per_box}</TableCell>

      <TableCell align="center">
        {product.width ? `${product.width} cms` : EMPTY_VALUE}
      </TableCell>

      <TableCell align="center">
        {product.height ? `${product.height} cms` : EMPTY_VALUE}
      </TableCell>

      {isAdmin && (
        <TableCell align="center">
          {saving ? (
            <CircularProgress size={20} />
          ) : (
            <Tooltip
              title={product.is_visible ? 'Click to hide' : 'Click to show'}
            >
              <SecondaryRoundIconButton onClick={toggleVisibility}>
                {product.is_visible ? (
                  <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
                ) : (
                  <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} />
                )}
              </SecondaryRoundIconButton>
            </Tooltip>
          )}
        </TableCell>
      )}

      {isAdmin && (
        <TableCell align="center">
          <SecondaryRoundIconButton
            onClick={() => onEdit(product)}
            sx={(theme) => ({
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,

              '&:hover': {
                borderColor: theme.palette.primary.dark,
                color: theme.palette.primary.dark,
              },
            })}
          >
            <EditIcon fontSize="small" />
          </SecondaryRoundIconButton>
        </TableCell>
      )}

      {isAdmin && (
        <TableCell align="center">
          <SecondaryRoundIconButton
            onClick={() => onDelete(product)}
            sx={(theme) => ({
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,

              '&:hover': {
                borderColor: theme.palette.error.dark,
                color: theme.palette.error.dark,
              },
            })}
          >
            <DeleteIcon fontSize="small" />
          </SecondaryRoundIconButton>
        </TableCell>
      )}
    </TableRow>
  );
}
