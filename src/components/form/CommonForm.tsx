import { Stack } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

import ValidationErrorsList from '@/src/components/common/ValidationErrorsList';
import FormFieldRenderer from '@/src/components/form/FormFieldRenderer';
import { validateField, validateForm } from '@/src/helpers/validators';
import { AnyFormField, FormField } from '@/src/types/types';

const prepareInitialState = <T extends Record<string, unknown>>(
  config: FormField<T>[],
) =>
  config.reduce<Record<string, unknown>>((acc, field) => {
    (acc as Record<string, unknown>)[field.key as string] = field.initialValue;
    return acc;
  }, {});

export default function CommonForm<T extends Record<string, unknown>>({
  formConfig,
  fillForm,
}: {
  fillForm: (form: T, isValid: boolean) => void;
  formConfig: FormField<T>[];
}) {
  const [form, setForm] = useState<T>(
    () => prepareInitialState(formConfig) as T,
  );

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const configMap: Record<string, FormField<T>> = useMemo(
    () => Object.fromEntries(formConfig.map((f) => [f.key, f])),
    [formConfig],
  );

  useEffect(() => {
    fillForm(form, validateForm(form, formConfig));
  }, [form, formConfig, fillForm]);

  const handleFieldChange = (field: keyof T, value: unknown) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);

    const fieldConfig = configMap[field as string];
    const errors = validateField(value, nextForm, fieldConfig?.rules);

    setValidationErrors((prev) => ({
      ...prev,
      [field]: errors,
    }));
  };

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const visibleErrors = Object.entries(validationErrors)
    .filter(([key]) => touched[key])
    .flatMap(([, errors]) => errors);

  const hasErrors = visibleErrors.length > 0;

  return (
    <Stack alignItems="flex-start" spacing={2} sx={{ width: '100%' }}>
      <Stack
        sx={{
          borderRadius: 2,
          backgroundColor: (theme) => theme.palette.background.paper,
          width: '100%',
        }}
        spacing={2}
      >
        <Stack spacing={2}>
          {formConfig
            .filter(({ visibility }) => visibility)
            .map((field) => (
              <FormFieldRenderer
                key={String(field.key)}
                field={field as unknown as AnyFormField}
                value={form[field.key]}
                onChange={(value) => handleFieldChange(field.key, value)}
                onBlur={() => handleFieldBlur(String(field.key))}
              />
            ))}
        </Stack>
      </Stack>

      {hasErrors && (
        <ValidationErrorsList
          formErrors={visibleErrors as unknown as Record<string, string[]>}
        />
      )}
    </Stack>
  );
}
