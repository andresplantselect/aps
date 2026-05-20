'use client';

import { Divider, Stack } from '@mui/material';
import React, { ReactNode } from 'react';

import CustomAlert from '@/src/components/common/CustomAlert';
import Loader from '@/src/components/common/Loader';
import Logo from '@/src/components/common/Logo';
import { useAlert } from '@/src/context/AlertContext';
import { useRequest } from '@/src/hooks/useRequest';

interface LayoutProps {
  actions?: ReactNode;
  children: ReactNode;
}

export default function Layout({ actions, children }: LayoutProps) {
  const { alert, clearAlert } = useAlert();
  const { loading } = useRequest();

  return (
    <Stack
      sx={{
        height: '100vh',
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{
          width: '100%',
          flexShrink: 0,
        }}
        px={{ xs: 2, md: 5 }}
        py={2}
      >
        <Logo />

        {!loading && actions}
      </Stack>

      <Divider
        sx={(theme) => ({
          borderColor: theme.palette.divider,
        })}
        flexItem
      />

      <Stack
        sx={{
          flex: 1,
          position: 'relative',
        }}
        px={{ xs: 1.5, md: 5 }}
        alignItems="center"
      >
        {alert && <CustomAlert alertState={alert} onClose={clearAlert} />}
        {loading ? <Loader /> : children}
      </Stack>
    </Stack>
  );
}
