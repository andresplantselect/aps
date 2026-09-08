'use client';

import CloseIcon from '@mui/icons-material/Close';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

interface FilterCheckboxGroupProps<T extends string> {
  label: string;
  value: T[];
  options: Record<string, string>;
  onChange: (value: T[]) => void;
}

export function FilterCheckboxGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: FilterCheckboxGroupProps<T>) {
  const toggle = (key: T) => {
    if (value.includes(key)) {
      onChange(value.filter((v) => v !== key));
    } else {
      onChange([...value, key]);
    }
  };

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="caption" fontWeight={600} color="text.secondary">
          {label}
        </Typography>
        {value.length > 0 && (
          <IconButton size="small" onClick={() => onChange([])}>
            <CloseIcon sx={{ fontSize: 14 }} />
          </IconButton>
        )}
      </Stack>
      <FormGroup>
        {Object.entries(options).map(([key, optLabel]) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                size="small"
                checked={value.includes(key as T)}
                onChange={() => toggle(key as T)}
                sx={{ py: 0.3 }}
              />
            }
            label={
              <Typography variant="body2" color="text.primary">
                {optLabel}
              </Typography>
            }
          />
        ))}
      </FormGroup>
    </Stack>
  );
}
