import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

import AddItemsCard from '@/src/components/common/AddItemsCard';
import { CartItemListProps } from '@/src/types/propsTypes';

export function CartItemsList({ items }: CartItemListProps) {
  if (!items.length) {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100%' }}
      >
        <Typography color="text.secondary">
          No hay productos en tu preorden.
        </Typography>
      </Stack>
    );
  }

  return (
    <Box sx={{ flex: 1, overflowY: 'auto' }}>
      <Stack spacing={1.5}>
        {items.map((item) => (
          <AddItemsCard key={item.id} productItem={item} title={item.title} />
        ))}
      </Stack>
    </Box>
  );
}
