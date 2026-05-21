'use client';

import React, { createContext, useContext } from 'react';

import { useDeliveryStatusDialog } from '@/src/hooks/useDeliveryStatusDialog';
import { usePreordersStatusDialog } from '@/src/hooks/usePreordersStatusDialog';
import { usePreordersTable } from '@/src/hooks/usePreordersTable';

type PreordersContextType = ReturnType<typeof usePreordersTable> &
  ReturnType<typeof usePreordersStatusDialog> &
  ReturnType<typeof useDeliveryStatusDialog>;

const PreordersContext = createContext<PreordersContextType | null>(null);

export function PreordersProvider({ children }: { children: React.ReactNode }) {
  const table = usePreordersTable();
  const dialog = usePreordersStatusDialog();
  const deliveryDialog = useDeliveryStatusDialog();

  const value: PreordersContextType = {
    ...dialog,
    ...deliveryDialog,
    ...table,
  };

  return (
    <PreordersContext.Provider value={value}>
      {children}
    </PreordersContext.Provider>
  );
}

export function usePreordersContext() {
  const ctx = useContext(PreordersContext);

  if (!ctx) {
    throw new Error(
      'usePreordersContext must be used inside PreordersProvider',
    );
  }

  return ctx;
}
