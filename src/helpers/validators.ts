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
    if (!value) return "Required";
    return null;
  },

  email: (value: unknown) => {
    if (typeof value !== "string") return "Invalid email";
    return /\S+@\S+\.\S+/.test(value) ? null : "Invalid email";
  },

  password: (value: unknown) => {
    if (typeof value !== "string") return "Invalid password";
    return value.length >= 8 ? null : "Min 8 characters";
  },

  number: (value: unknown) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    const parsed = parseNumberInput(value);

    if (parsed === null) {
      return "Invalid number value";
    }

    return Number.isInteger(parsed) ? null : "Invalid number value";
  },

  decimalNumber: (value: unknown) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return parseNumberInput(value) === null ? "Invalid number value" : null;
  },

  confirmPassword: (value: unknown, form: unknown) => {
    if (
      typeof form === "object" &&
      form !== null &&
      "password" in form &&
      value !== (form as { password?: unknown }).password
    ) {
      return "Passwords do not match";
    }

    return null;
  },
};
