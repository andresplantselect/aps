'use client';

import {
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { DialogHeaderBar } from '@/src/components/common/DialogHeaderBar';
import { useAlert } from '@/src/context/AlertContext';
import { useProducts } from '@/src/context/ProductsContext';
import { useBulkDeleteProducts } from '@/src/hooks/api';
import { PrimaryButton, SecondaryButton } from '@/src/styledComponents';

export function ProductsBulkDeleteDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { products } = useProducts();
  const { showAlert } = useAlert();
  const { bulkDeleteProducts } = useBulkDeleteProducts();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleClose = () => {
    setSelectedIds([]);
    setConfirming(false);
    onClose();
  };

  const handleConfirmDelete = async () => {
    const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
    const { error, success } = await bulkDeleteProducts(selectedProducts);

    if (error) showAlert(error);
    else if (success) showAlert(success);

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogHeaderBar>Eliminar varios artículos</DialogHeaderBar>
      <DialogContent>
        {confirming ? (
          <Stack spacing={2}>
            <Typography>
              Eliminar {selectedIds.length}{' '}
              {selectedIds.length === 1 ? 'artículo' : 'artículos'}? Esta acción
              no se puede deshacer.
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={2}>
              <SecondaryButton onClick={() => setConfirming(false)}>
                Volver
              </SecondaryButton>
              <PrimaryButton
                onClick={handleConfirmDelete}
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
          </Stack>
        ) : (
          <Stack spacing={2}>
            <FormGroup sx={{ maxHeight: 360, overflowY: 'auto' }}>
              {products.map((product) => (
                <FormControlLabel
                  key={product.id}
                  control={
                    <Checkbox
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggle(product.id)}
                    />
                  }
                  label={product.title}
                />
              ))}
            </FormGroup>

            <Stack direction="row" justifyContent="center" spacing={2}>
              <SecondaryButton onClick={handleClose}>Cancelar</SecondaryButton>
              <PrimaryButton
                disabled={selectedIds.length === 0}
                onClick={() => setConfirming(true)}
              >
                Eliminar
              </PrimaryButton>
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
