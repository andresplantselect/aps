'use client';
import BlockIcon from '@mui/icons-material/Block';
import GrassIcon from '@mui/icons-material/Grass';
import HeightIcon from '@mui/icons-material/Height';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import { Typography, Stack, Box } from '@mui/material';
import React from 'react';

import { ProductType } from '@/src/types/types';

export default function ProductInfo({ product }: { product: ProductType }) {
  return (
    <Box>
      <Stack>
        <Typography
          sx={{ pl: 0.5, fontWeight: 600, fontSize: 20 }}
          color="primary"
        >
          {product.price} €
        </Typography>

        <Stack spacing={1} alignItems="flex-start" sx={{ mt: 0.5 }}>
          <Stack direction="row" spacing={0.5}>
            <BlockIcon fontSize="small" />
            <Typography variant="body2">
              Maceta: {product.width ? `${product.width} cms` : '--'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            <HeightIcon fontSize="small" />
            <Typography variant="body2">
              Altura: {product.height ? `${product.height} cms` : '--'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            <GrassIcon fontSize="small" />
            <Stack>
              <Typography variant="body2">
                Uds × Caja: {product.units_per_box}
              </Typography>{' '}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            <YardOutlinedIcon fontSize="small" />
            <Stack>
              <Typography variant="body2">
                Disponible por Uds: {product.can_buy_units ? 'Si' : 'No'}
              </Typography>{' '}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
