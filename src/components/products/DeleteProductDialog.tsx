'use client';

import { Dialog, DialogContent, Stack, Typography } from '@mui/material';

import { DialogHeaderBar } from '@/src/components/common/DialogHeaderBar';
import { useAlert } from '@/src/context/AlertContext';
import { useDeleteProduct } from '@/src/hooks/api';
import { PrimaryButton, SecondaryButton } from '@/src/styledComponents';
import { DeleteProductDialogProps } from '@/src/types/propsTypes';
import { ProductType } from '@/src/types/types';

export default function DeleteProductDialog({
  product,
  open,
  onClose,
}: DeleteProductDialogProps) {
  const { showAlert } = useAlert();
  const { deleteProduct } = useDeleteProduct();

  const handleDelete = async (selectedProduct: ProductType) => {
    const { error, success } = await deleteProduct(selectedProduct);

    if (error) return showAlert(error);
    if (success) {
      showAlert(success);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogHeaderBar>Eliminar artículo</DialogHeaderBar>
      <DialogContent>
        <Typography sx={{ mb: 1 }}>Eliminar {product.title}?</Typography>

        <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>

          <PrimaryButton
            onClick={() => handleDelete(product as ProductType)}
            sx={{
              backgroundColor: 'error.main',
              borderColor: 'error.main',
              '&:hover': {
                backgroundColor: 'error.dark',
                borderColor: 'error.dark',
              },
            }}
          >
            Eliminar
          </PrimaryButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
