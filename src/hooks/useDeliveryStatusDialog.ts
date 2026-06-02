import { useState } from 'react';

import { OrderType } from '@/src/types/types';

export const useDeliveryStatusDialog = () => {
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);

  const [selectedDeliveryOrder, setSelectedDeliveryOrder] =
    useState<OrderType | null>(null);

  const openDeliveryDialog = (order: OrderType) => {
    setSelectedDeliveryOrder(order);
    setDeliveryDialogOpen(true);
  };

  const closeDeliveryDialog = () => {
    setDeliveryDialogOpen(false);
    setSelectedDeliveryOrder(null);
  };

  return {
    deliveryDialogOpen,
    selectedDeliveryOrder,
    openDeliveryDialog,
    closeDeliveryDialog,
  };
};
