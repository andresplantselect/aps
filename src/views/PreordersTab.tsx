'use client';

import { Stack, Typography } from '@mui/material';
import React from 'react';

import { PreordersDeliveryStatusDialog } from '@/src/components/preorders/PreordersDeliveryStatusDialog';
import { PreordersGrid } from '@/src/components/preorders/PreordersGrid';
import { PreordersHistorySection } from '@/src/components/preorders/PreordersHistorySection';
import { PreordersStatusDialog } from '@/src/components/preorders/PreordersStatusDialog';
import { PreordersTable } from '@/src/components/preorders/PreordersTable';
import { PreordersToolbar } from '@/src/components/preorders/PreordersToolbar';
import { PreordersProvider } from '@/src/context/PreordersContext';
import { usePreordersContext } from '@/src/context/PreordersContext';

function PreordersContent() {
  const { viewMode, showHistory } = usePreordersContext();

  return (
    <>
      <PreordersToolbar />
      {showHistory && <PreordersHistorySection />}
      <Stack spacing={1} mb={2}>
        <Typography variant="h6" color="primary.main">
          Pedidos actuales
        </Typography>
        {viewMode === 'table' ? <PreordersTable /> : <PreordersGrid />}
      </Stack>
      <PreordersStatusDialog />
      <PreordersDeliveryStatusDialog />
    </>
  );
}

export default function PreordersTab() {
  return (
    <PreordersProvider>
      <PreordersContent />
    </PreordersProvider>
  );
}
