'use client';

import { Stack, Typography } from '@mui/material';

import { PreordersHistoryGrid } from '@/src/components/preorders/PreordersHistoryGrid';
import { PreordersHistoryTable } from '@/src/components/preorders/PreordersHistoryTable';
import { usePreordersContext } from '@/src/context/PreordersContext';

export function PreordersHistorySection() {
  const { viewMode } = usePreordersContext();

  return (
    <Stack spacing={1} mb={2}>
      <Typography variant="h6" color="primary.main">
        Historial de pedidos
      </Typography>
      {viewMode === 'table' ? (
        <PreordersHistoryTable />
      ) : (
        <PreordersHistoryGrid />
      )}
    </Stack>
  );
}
