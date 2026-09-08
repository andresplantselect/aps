import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

export function DialogHeaderBar({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ backgroundColor: 'primary.main', px: 3, py: 1.5 }}>
      <Typography
        sx={(theme) => ({
          color: theme.palette.primary.contrastText,
          fontWeight: 600,
          fontSize: '1.5rem',
        })}
      >
        {children}
      </Typography>
    </Box>
  );
}
