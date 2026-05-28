import { parseNumberInput } from "@/src/helpers/helpers";
import { FormField, ValidationRule } from "@/src/types/types";

export function validateField<Form>(
  value: unknown,
  form: Form,
  rules: ValidationRule<Form>[],
): string[] {
  return rules
    .map((rule) => rule(value, form))
    .filter((msg): msg is string => Boolean(msg));
}

export const validateForm = <Form extends Record<string, unknown>>(
  form: Form,
  config: FormField<Form>[],
): boolean => {
  const hasError = config.some((field) =>
    (field.rules ?? []).some((rule) => rule(form[field.key], form) !== null),
  );

  return !hasError;
};

export const validationRules = {
  required: (value: unknown) => {
    if (!value) return "Campo obligatorio";
    return null;
  },

  moreThan: (compareNum: number) => (value: unknown) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    const parsed = parseNumberInput(value);

    if (parsed === null) {
      return "Valor numérico inválido";
    }

    return parsed > compareNum
      ? null
      : `El valor debe ser mayor que ${compareNum}`;
  },

  email: (value: unknown) => {
    if (typeof value !== "string") return "Correo electrónico inválido";
    return /\S+@\S+\.\S+/.test(value) ? null : "Correo electrónico inválido";
  },

  password: (value: unknown) => {
    if (typeof value !== "string") return "Contraseña inválida";
    return value.length >= 8 ? null : "Mínimo 8 caracteres";
  },

  number: (value: unknown) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    const parsed = parseNumberInput(value);

    if (parsed === null) {
      return "Valor numérico inválido";
    }

    return Number.isInteger(parsed) ? null : "Valor numérico inválido";
  },

  decimalNumber: (value: unknown) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return parseNumberInput(value) === null ? "Valor numérico inválido" : null;
  },

  confirm: (value: unknown, form: unknown) => {
    if (
      typeof form === "object" &&
      form !== null &&
      "password" in form &&
      value !== (form as { password?: unknown }).password
    ) {
      return "Las contraseñas no coinciden";
    }

    return null;
  },
};
