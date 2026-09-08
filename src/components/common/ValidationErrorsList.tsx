import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Stack, Typography } from '@mui/material';
import React from 'react';

export default function ValidationErrorsList({
  formErrors,
}: {
  formErrors: Record<string, string[]>;
}) {
  const validationErrors = [...new Set(Object.values(formErrors).flat())];

  return (
    <Stack spacing={0.5}>
      {validationErrors.map((e, i) => (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          key={`${e}-${i}`}
        >
          <ErrorOutlineIcon color="error" sx={{ width: 14 }} />
          <Typography variant="caption" color="error">
            {e}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
