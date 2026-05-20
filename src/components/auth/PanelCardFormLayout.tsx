'use client';

import { Stack } from '@mui/material';
import React from 'react';

import CustomAlert from '@/src/components/common/CustomAlert';
import Loader from '@/src/components/common/Loader';
import Logo from '@/src/components/common/Logo';
import { useRequest } from '@/src/hooks/useRequest';
import { PanelCard, PrimaryButton } from '@/src/styledComponents';
import { PanelCardFormLayoutProps } from '@/src/types/propsTypes';

export default function PanelCardFormLayout({
  alert,
  setAlert,
  children,
  submit,
}: PanelCardFormLayoutProps) {
  const { loading } = useRequest();

  return (
    <Stack
      sx={{ height: '100vh', position: 'relative' }}
      justifyContent="center"
      alignItems="center"
      px={{ xs: 1.5, md: 5 }}
    >
      {loading ? (
        <Loader />
      ) : (
        <PanelCard
          sx={{
            px: 3,
            py: 4,
            maxWidth: 500,
          }}
        >
          <Stack alignItems="center" spacing={4}>
            {children}
            <PrimaryButton type="submit" onClick={submit.handler}>
              {submit.title}
            </PrimaryButton>
          </Stack>
        </PanelCard>
      )}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          flexShrink: 0,
        }}
        px={{ xs: 2, md: 5 }}
        py={2}
      >
        <Logo />
      </Stack>

      {alert && (
        <CustomAlert alertState={alert} onClose={() => setAlert(null)} />
      )}
    </Stack>
  );
}
