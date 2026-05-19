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
      {icon}

      <Typography variant="h6">{message}</Typography>
    </Stack>
  );
}
