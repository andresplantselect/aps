'use client';

import { Dialog, DialogContent, Stack, Typography, Box } from '@mui/material';

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
      <Box sx={{ backgroundColor: 'primary.main', px: 3, py: 1.5 }}>
        <Typography
          sx={{ color: 'primary.contrastText', fontWeight: 600, fontSize: 16 }}
        >
          Eliminar artículo
        </Typography>
      </Box>
      <DialogContent>
        <Typography sx={{ mb: 1 }}>¿Eliminar {product.title}?</Typography>

        <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
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
