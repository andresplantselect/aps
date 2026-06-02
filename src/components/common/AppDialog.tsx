'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, Box, IconButton, Typography, Stack } from '@mui/material';
import React from 'react';

import CustomAlert from '@/src/components/common/CustomAlert';
import Loader from '@/src/components/common/Loader';
import { useRequest } from '@/src/hooks/useRequest';
import { PrimaryButton, SecondaryButton } from '@/src/styledComponents';
import { AppDrawerProps } from '@/src/types/propsTypes';

export function AppDialog({
  open,
  onClose,
  title,
  icon,
  header,
  children,
  alertState,
  primaryButton,
  secondaryButton,
  setAlertState,
}: AppDrawerProps) {
  const { loading } = useRequest();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          width: { xs: 'calc(100vw - 32px)', sm: 480 },
          maxWidth: { xs: '100%', sm: 480 },
          margin: { xs: 2, sm: 4 },
          height: { xs: 'calc(100vh - 32px)', sm: 'calc(100vh - 64px)' },
          borderRadius: '14px',
        },
      }}
    >
      {title && (
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: 'background.paper',
            borderRadius: '14px 14px 0 0',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            {icon && <Box>{icon}</Box>}
            <Typography variant="h6">{title}</Typography>
          </Stack>

          {onClose && (
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      )}

      {header}

      <Stack sx={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        {alertState && (
          <CustomAlert
            alertState={alertState}
            onClose={() => setAlertState?.(null)}
          />
        )}

        {loading ? (
          <Loader />
        ) : (
          <Stack
            sx={{ flex: 1, overflowY: 'auto', p: 2 }}
            justifyContent="space-between"
          >
            {children}

            {(primaryButton || secondaryButton) && (
              <Stack spacing={1} sx={{ mt: 2 }}>
                {primaryButton && (
                  <PrimaryButton
                    disabled={primaryButton.disabled}
                    onClick={primaryButton.handleSubmit}
                    sx={{ width: '100%' }}
                  >
                    {primaryButton.title}
                  </PrimaryButton>
                )}

                {secondaryButton && (
                  <SecondaryButton
                    disabled={secondaryButton.disabled}
                    onClick={secondaryButton.handleSubmit}
                    sx={{ width: '100%' }}
                  >
                    {secondaryButton.title}
                  </SecondaryButton>
                )}
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </Dialog>
  );
}
