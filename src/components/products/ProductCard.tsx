'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Typography, Box, Stack, Divider } from '@mui/material';
import React from 'react';

import AddItemsCard from '@/src/components/common/AddItemsCard';
import ProductImages from '@/src/components/products/ProductImages';
import ProductInfo from '@/src/components/products/ProductInfo';
import { useAuth } from '@/src/context/AuthContext';
import { useCart } from '@/src/context/CartContext';
import {
  PanelCard,
  CardEditButton,
  CardDeleteButton,
} from '@/src/styledComponents';
import { ProductCardProps } from '@/src/types/propsTypes';

export default function ProductCard({
  product,
  onDelete,
  onEdit,
}: ProductCardProps) {
  const { isAdmin, isUser } = useAuth();
  const { items } = useCart();

  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const availableStock = product.available - quantity;

  return (
    <PanelCard
      sx={{
        minWidth: 300,
        maxWidth: 350,
      }}
    >
      <Stack sx={{ height: '100%', p: 0.5 }} justifyContent="space-between">
        <Stack spacing={2.5}>
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                sx={{
                  lineHeight: 1.35,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  fontWeight: 600,
                  fontSize: 20,
                }}
              >
                {product.title}
              </Typography>
              {isAdmin && (
                <>
                  {product.is_visible ? (
                    <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} />
                  )}
                </>
              )}
            </Stack>

            <Typography
              variant="body2"
              color={product.available > 0 ? 'primary' : 'error'}
            >
              Disponible: {availableStock}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 96,
                height: 96,
                border: '1px solid',
                borderRadius: 1,
                borderColor: (theme) => theme.palette.grey[200],
                bgcolor: (theme) => theme.palette.grey[200],
                overflow: 'hidden',
              }}
            >
              <ProductImages
                images={product.images ?? []}
                title={product.title}
              />
            </Box>

            <ProductInfo product={product} />
          </Stack>

          <Stack spacing={1}>
            {product.comment && (
              <Stack spacing={0.5}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Detalles:
                </Typography>
                <Typography variant="body2">{product.comment}</Typography>
              </Stack>
            )}
          </Stack>
        </Stack>

        <Stack>
          {isAdmin && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ mt: 2 }}
            >
              <CardEditButton
                onClick={() => onEdit(product)}
                startIcon={<EditIcon sx={{ fontSize: 18 }} />}
              >
                Editar
              </CardEditButton>

              <Divider
                sx={(theme) => ({
                  borderColor: theme.palette.divider,
                })}
                orientation="vertical"
                flexItem
              />

              <CardDeleteButton
                onClick={() => onDelete(product)}
                startIcon={<DeleteIcon sx={{ fontSize: 18 }} />}
              >
                Eliminar
              </CardDeleteButton>
            </Stack>
          )}
          {isUser && (
            <AddItemsCard
              productItem={product}
              labelAdd="Añadir a la reserva"
              labelTotal="Total en carrito"
              showClearCart={true}
            />
          )}
        </Stack>
      </Stack>
    </PanelCard>
  );
}
