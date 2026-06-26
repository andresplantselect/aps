'use client';

import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import { Box, LinearProgress } from '@mui/material';
import { isEmpty } from 'ramda';

import EmptyStateMessage from '@/src/components/common/EmptyStateMessage';
import { PreordersCard } from '@/src/components/preorders/PreordersCard';
import { usePreordersContext } from '@/src/context/PreordersContext';

export function PreordersGrid() {
  const { sortedOrders, isOrdersLoading } = usePreordersContext();

  if (isOrdersLoading) return <LinearProgress />;

  if (isEmpty(sortedOrders)) {
    return (
      <EmptyStateMessage
        message="No hay pedidos todavía"
        icon={<TextSnippetOutlinedIcon />}
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(auto-fill, minmax(320px, 1fr))',
        },
        gap: 1,
      }}
    >
      {sortedOrders.map((order) => (
        <PreordersCard key={order.id} order={order} />
      ))}
    </Box>
  );
}
