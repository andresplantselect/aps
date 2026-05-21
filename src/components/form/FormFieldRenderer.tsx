import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import React from 'react';

import ImageUploader from '@/src/components/common/ImageUploader';
import PasswordFields from '@/src/components/common/PasswordFields';
import { FieldProps } from '@/src/types/propsTypes';

export default function FormFieldRenderer({
  field,
  value,
  onChange,
  onBlur,
}: FieldProps) {
  if (field.type === 'text') {
    return (
      <TextField
        label={field.label}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        fullWidth
        required={field.required}
      />
    );
  }

  if (field.type === 'boolean') {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={(value as boolean) ?? false}
            required={field.required}
            onChange={(e) => onChange(e.target.checked)}
          />
        }
        label={field.label}
      />
    );
  }

  if (field.type === 'textarea') {
    return (
      <TextField
        label={field.label}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        fullWidth
        required={field.required}
        multiline
        rows={3}
      />
    );
  }

  if (field.type === 'password') {
    return (
      <PasswordFields
        password={{
          value: value as string,
          onChange: onChange as (v: string) => void,
          onBlur,
        }}
        disabled={field.disabled}
        required={field.required}
      />
    );
  }

  if (field.type === 'confirm') {
    return (
      <PasswordFields
        confirm={{
          value: value as string,
          onChange: onChange as (v: string) => void,
          onBlur,
        }}
        disabled={field.disabled}
        required={field.required}
      />
    );
  }

  if (field.type === 'images') {
    return (
      <ImageUploader
        initialImages={(field.initialValue as string[]) || []}
        onChange={(urls) => onChange(urls)}
      />
    );
  }

  return null;
}
