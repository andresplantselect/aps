import { AlertColor } from "@mui/material";
import React from "react";

export interface ProductType {
  id: string;
  title: string;
  price: number;
  created_at: string;
  comment?: string;
  units_per_box: number;
  images: string[];
  totalOrdered: number;
  available: number;
  height?: string;
  width?: string;
  can_buy_units: boolean;
}

export interface UserType {
  id: string;
  name?: string;
  role?: "user" | "admin";
  created_at?: string;
  email?: string;
}

export type SignInFormType = {
  email: string;
  password: string;
};

export type ForgotPasswordFormType = {
  email: string;
};

export type PasswordFormType = {
  password: string;
  confirmPassword: string;
};

export type SignUpFormType = {
  name: string;
  email: string;
  password: string;
};

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  available: number;
  units_per_box: number;
  can_buy_units: boolean;
}

export interface OrderItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  units_per_box: number;
}

export type OrderStatusType = "pending" | "approved" | "cancelled";
export type DisponibilityType = "available" | "outOfStock";

export interface OrderType {
  id: number;
  user_id: string;
  items: OrderItem[];
  total: number;
  comment?: string;
  admin_comment?: string;
  status: OrderStatusType;
  created_at: string;
  profile_name?: string;
}

export type AlertType = {
  message: string;
  severity: AlertColor;
  duration?: number | null;
} | null;

export type InputFieldType =
  | "text"
  | "number"
  | "password"
  | "textarea"
  | "images"
  | "confirm";

export type FormField<Form> = {
  disabled?: boolean;
  key: keyof Form;
  label?: string;
  initialValue: Form[keyof Form];
  type: InputFieldType;
  visibility: boolean;
  rules: ValidationRule<unknown>[];
  required?: boolean;
  inputProps?: Record<string, unknown>;
};

export type ValidationRule<Form = unknown> = (
  value: unknown,
  form: Form,
) => string | null;

export type AnyFormField = FormField<Record<string, unknown>>;

export type RequestResult<T> = {
  success: AlertType;
  error: AlertType;
  data: T | null;
};

export type MenuAction = {
  value: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  visibility: boolean;
};

export type ProductsViewType = "cards" | "table";

export type ProductSortKey = "title" | "available" | "price";
