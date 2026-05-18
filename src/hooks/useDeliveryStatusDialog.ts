import { useState } from 'react';

import { OrderType } from '@/src/types/types';

export const useDeliveryStatusDialog = () => {
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  const openDeliveryDialog = (order: OrderType) => {
    setSelectedOrder(order);
    setDeliveryDialogOpen(true);
  };

  const closeDeliveryDialog = () => {
    setDeliveryDialogOpen(false);
    setSelectedOrder(null);
  };

  return {
    deliveryDialogOpen,
    selectedOrder,
    openDeliveryDialog,
    closeDeliveryDialog,
  };
};
