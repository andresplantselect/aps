'use client';

import {
  Dialog,
  DialogContent,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useAlert } from '@/src/context/AlertContext';
import { useOrders } from '@/src/context/OrdersContext';
import { usePreordersContext } from '@/src/context/PreordersContext';
import { useUpdateDeliveryStatus } from '@/src/hooks/api';
import { PrimaryButton, SecondaryButton } from '@/src/styledComponents';

export function PreordersDeliveryStatusDialog() {
  const [delivered, setDelivered] = useState(true);

  const label = delivered ? 'Pedido entregado' : 'Entrega cancelada';

  const { deliveryDialogOpen, closeDeliveryDialog, selectedDeliveryOrder } =
    usePreordersContext();
  const { showAlert } = useAlert();
  const { updateDeliveryStatus } = useUpdateDeliveryStatus();
  const { refreshOrders } = useOrders();

  const confirmDelivery = async () => {
    if (!selectedDeliveryOrder) return;

    const { success, error } = await updateDeliveryStatus(
      selectedDeliveryOrder.id,
      delivered ? 'delivered' : 'failed',
    );

    if (error) return showAlert(error);

    if (success) showAlert(success);

    closeDeliveryDialog();
    void refreshOrders();
  };

  return (
    <Dialog open={deliveryDialogOpen} onClose={closeDeliveryDialog}>
      <DialogContent>
        <Stack alignItems="center" justifyContent="center">
          <Typography>{label}</Typography>
          <Switch
            checked={delivered}
            onChange={(e) => setDelivered(e.target.checked)}
          />
        </Stack>

        <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
          <SecondaryButton onClick={closeDeliveryDialog}>
            Cerrar
          </SecondaryButton>
          <PrimaryButton onClick={confirmDelivery}>Confirmar</PrimaryButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
