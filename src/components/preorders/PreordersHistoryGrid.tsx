'use client';

import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import { Box } from '@mui/material';
import { isEmpty } from 'ramda';

import EmptyStateMessage from '@/src/components/common/EmptyStateMessage';
import { PreordersCard } from '@/src/components/preorders/PreordersCard';
import { usePreordersContext } from '@/src/context/PreordersContext';

export function PreordersHistoryGrid() {
  const { sortedHistoryOrders } = usePreordersContext();

  if (isEmpty(sortedHistoryOrders)) {
    return (
      <EmptyStateMessage
        message="No hay pedidos en el historial"
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
          sm: 'repeat(auto-fill, minmax(330px, 1fr))',
        },
        gap: 1,
      }}
    >
      {sortedHistoryOrders.map((order) => (
        <PreordersCard key={order.id} order={order} />
      ))}
    </Box>
  );
}
