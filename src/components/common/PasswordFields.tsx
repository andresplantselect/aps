'use client';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { useState, forwardRef, useImperativeHandle } from 'react';

export type PasswordFieldsRef = {
  resetVisibility: () => void;
};

interface PasswordFieldsProps {
  confirm?: {
    onChange: (value: string) => void;
    value: string;
  };
  password?: {
    onChange: (value: string) => void;
    value: string;
  };
  disabled?: boolean;
  required?: boolean;
}

const PasswordFields = forwardRef<PasswordFieldsRef, PasswordFieldsProps>(
  ({ password, confirm, disabled = false, required = true }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useImperativeHandle(ref, () => ({
      resetVisibility() {
        setShowPassword(false);
        setShowConfirmPassword(false);
      },
    }));

    return (
      <Stack spacing={2} sx={{ width: '100%' }}>
        {password && (
          <TextField
            label="Contraseña"
            type={showPassword && !disabled ? 'text' : 'password'}
            value={
              !password.value && disabled ? '00000000000000' : password.value
            }
            onChange={(e) => password?.onChange(e.target.value)}
            fullWidth
            required={required}
            disabled={disabled}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ display: disabled ? 'none' : 'flex' }}
                >
                  <IconButton
                    onClick={() => setShowPassword((p) => !p)}
                    edge="end"
                    disabled={disabled}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}

        {confirm && (
          <TextField
            label="Confirmar Contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirm.value}
            onChange={(e) => confirm?.onChange(e.target.value)}
            fullWidth
            required={required}
            disabled={disabled}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      </Stack>
    );
  },
);

PasswordFields.displayName = 'PasswordFields';

export default PasswordFields;
