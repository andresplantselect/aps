'use client';

import { Snackbar, Alert } from '@mui/material';

import { CustomAlertProps } from '@/src/types/propsTypes';

export default function CustomAlert({ alertState, onClose }: CustomAlertProps) {
  if (!alertState) return null;

  return (
    <Snackbar
      open
      autoHideDuration={alertState.duration || 3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={alertState.severity}
        sx={(theme) => ({
          backgroundColor: theme.palette.background.paper,
          border: `1.5px solid ${theme.palette[alertState.severity].main}`,
          color: theme.palette[alertState.severity].main,
          alignItems: 'center',
          minWidth: 280,
          maxWidth: 480,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        })}
      >
        {alertState.message}
      </Alert>
    </Snackbar>
  );
}
