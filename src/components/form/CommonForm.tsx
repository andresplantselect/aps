import { Stack } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

import PasswordFields from '@/src/components/common/PasswordFields';
import ValidationErrorsList from '@/src/components/common/ValidationErrorsList';
import { formConfigFieldsDict } from '@/src/components/form/formConfigs';
import FormFieldRenderer from '@/src/components/form/FormFieldRenderer';
import { validateField, validateForm } from '@/src/helpers/validators';
import { AnyFormField, DictEntry, FormField } from '@/src/types/types';

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
  onSubmit,
}: {
  fillForm: (form: T, isValid: boolean) => void;
  formConfig: FormField<T>[];
  onSubmit?: () => void;
}) {
  const [form, setForm] = useState<T>(
    () => prepareInitialState(formConfig) as T,
  );

  const validationErrors = useMemo(() => {
    return formConfig.reduce<Record<string, string[]>>((acc, field) => {
      const value = form[field.key];
      const errors = validateField(value, form, field.rules);

      if (errors.length > 0) {
        acc[String(field.key)] = errors;
      }

      return acc;
    }, {});
  }, [form, formConfig]);

  useEffect(() => {
    fillForm(form, validateForm(form, formConfig));
  }, [form, formConfig, fillForm]);

  const handleFieldChange = (field: keyof T, value: unknown) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
  };

  const visibleErrors = Object.entries(validationErrors).flatMap(
    ([key, errors]) =>
      errors.map(
        (error) =>
          `${(formConfigFieldsDict as Record<string, DictEntry>)[key].label}: ${error}`,
      ),
  );

  const hasErrors = visibleErrors.length > 0;

  return (
    <Stack
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      alignItems="flex-start"
      spacing={2}
      sx={{ width: '100%' }}
    >
      <Stack
        sx={{
          borderRadius: 2,
          backgroundColor: (theme) => theme.palette.background.paper,
          width: '100%',
        }}
        spacing={2}
      >
        <Stack spacing={2}>
          {(() => {
            const visibleFields = formConfig.filter(
              ({ visibility }) => visibility,
            );
            const nodes: React.ReactNode[] = [];
            for (let i = 0; i < visibleFields.length; i++) {
              const field = visibleFields[i];
              const next = visibleFields[i + 1];
              if (field.type === 'password' && next?.type === 'confirm') {
                nodes.push(
                  <PasswordFields
                    key="password-confirm"
                    password={{
                      value: form[field.key] as string,
                      onChange: (v) => handleFieldChange(field.key, v),
                    }}
                    confirm={{
                      value: form[next.key] as string,
                      onChange: (v) => handleFieldChange(next.key, v),
                    }}
                    required={field.required}
                  />,
                );
                i++;
              } else {
                nodes.push(
                  <FormFieldRenderer
                    key={String(field.key)}
                    field={field as unknown as AnyFormField}
                    value={form[field.key]}
                    onChange={(value) => handleFieldChange(field.key, value)}
                  />,
                );
              }
            }
            return nodes;
          })()}
        </Stack>
      </Stack>

      {hasErrors && (
        <ValidationErrorsList
          formErrors={visibleErrors as unknown as Record<string, string[]>}
        />
      )}

      {/* Hidden submit button: without it, browsers only auto-submit a
          form on Enter when it has exactly one text field. Since our
          real submit button lives outside this <form> (in AppDialog),
          this restores Enter-to-submit for forms with multiple fields. */}
      <button
        type="submit"
        style={{ display: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
      />
    </Stack>
  );
}
