import { Stack, Typography } from '@mui/material';
import React from 'react';

export default function EmptyStateMessage({
  message,
  icon,
}: {
  message: string;
  icon: React.ReactNode;
}) {
  return (
    <Stack
      spacing={1}
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: 300,
      }}
    >
      <Stack sx={{ color: 'grey.500', fontSize: 32 }}>{icon}</Stack>

      <Typography color={'grey.500'}>{message}</Typography>
    </Stack>
  );
}
