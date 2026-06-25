'use client';

import React from 'react';

import { PreordersDeliveryStatusDialog } from '@/src/components/preorders/PreoprdersDeliveryStatusDialog';
import { PreordersGrid } from '@/src/components/preorders/PreordersGrid';
import { PreordersStatusDialog } from '@/src/components/preorders/PreordersStatusDialog';
import { PreordersTable } from '@/src/components/preorders/PreordersTable';
import { PreordersToolbar } from '@/src/components/preorders/PreordersToolbar';
import { PreordersProvider } from '@/src/context/PreordersContext';
import { usePreordersContext } from '@/src/context/PreordersContext';

function PreordersContent() {
  const { viewMode } = usePreordersContext();

  return (
    <>
      <PreordersToolbar />
      {viewMode === 'table' ? <PreordersTable /> : <PreordersGrid />}
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
