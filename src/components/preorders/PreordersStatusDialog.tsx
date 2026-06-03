'use client';

import {
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Stack,
  Box,
} from '@mui/material';

import { useAlert } from '@/src/context/AlertContext';
import { useOrders } from '@/src/context/OrdersContext';
import { usePreordersContext } from '@/src/context/PreordersContext';
import { useUpdateOrderStatus } from '@/src/hooks/api';
import { PrimaryButton, SecondaryButton } from '@/src/styledComponents';

export function PreordersStatusDialog() {
  const {
    dialogOpen,
    selectedOrder,
    nextStatus,
    adminComment,
    closeDialog,
    setAdminComment,
  } = usePreordersContext();

  const { showAlert } = useAlert();
  const { updateOrderStatus } = useUpdateOrderStatus();
  const { refreshOrders } = useOrders();

  const applyStatus = async () => {
    console.log('selectedOrder', selectedOrder);
    if (!selectedOrder || !nextStatus) return;

    const { success, error } = await updateOrderStatus(
      selectedOrder.id,
      nextStatus,
      adminComment,
    );

    if (error) return showAlert(error);

    if (success) showAlert(success);

    closeDialog();
    void refreshOrders();
  };

  return (
    <Dialog open={dialogOpen} onClose={closeDialog} fullWidth>
      <Box sx={{ backgroundColor: 'primary.main', px: 3, py: 1.5 }}>
        <Typography
          sx={{ color: 'primary.contrastText', fontWeight: 600, fontSize: 16 }}
        >
          {nextStatus === 'approved' ? 'Aprobar pedido' : 'Rechazar pedido'}
        </Typography>
      </Box>
      <DialogContent>
        <Typography sx={{ mb: 1 }}>Comentario del administrador:</Typography>

        <TextField
          fullWidth
          multiline
          rows={3}
          value={adminComment}
          onChange={(e) => setAdminComment(e.target.value)}
        />

        <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
          <SecondaryButton onClick={closeDialog}>Cerrar</SecondaryButton>
          <PrimaryButton onClick={applyStatus}>
            {nextStatus === 'approved' ? 'Aprobar' : 'Rechazar'}
          </PrimaryButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
