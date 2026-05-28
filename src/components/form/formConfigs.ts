import { validationRules } from "@/src/helpers/validators";
import { ProductForm } from "@/src/types/propsTypes";
import {
  DictEntry,
  FormField,
  InputFieldType,
  ProductType,
} from "@/src/types/types";

export const formConfigFieldsDict = {
  name: {
    key: "name" as const,
    label: "Nombre",
    initialValue: "",
    required: true,
    type: "text",
    visibility: true,
    rules: [validationRules.required],
  },
  email: {
    key: "email" as const,
    label: "Correo electrónico",
    initialValue: "",
    required: true,
    type: "text" as InputFieldType,
    visibility: true,
    rules: [validationRules.required, validationRules.email],
  },
  password: {
    key: "password" as const,
    initialValue: "",
    label: "Contraseña",
    required: true,
    type: "password" as InputFieldType,
    visibility: true,
    rules: [validationRules.required, validationRules.password],
  },
  confirm: {
    key: "confirm" as const,
    label: "Confirmar Contraseña",
    initialValue: "",
    required: true,
    type: "confirm" as InputFieldType,
    visibility: true,
    rules: [validationRules.required, validationRules.confirm],
  },
  title: {
    key: "title" as const,
    label: "Título",
    initialValue: "",
    required: true,
    type: "text" as InputFieldType,
    visibility: true,
    rules: [validationRules.required],
  },
  price: {
    key: "price" as const,
    label: "Precio",
    initialValue: "",
    required: false,
    type: "text" as InputFieldType,
    visibility: true,
    helperText: "Ej: 12.50",
    rules: [validationRules.decimalNumber],
  },
  units_per_box: {
    key: "units_per_box" as const,
    label: "Unidades por caja",
    initialValue: "",
    required: true,
    type: "text" as InputFieldType,
    visibility: true,
    rules: [validationRules.required, validationRules.moreThan(0)],
    helperText: "Min. 1",
  },
  can_buy_units: {
    key: "can_buy_units" as const,
    label: "Permitir compra por unidades",
    initialValue: false,
    required: false,
    type: "boolean" as InputFieldType,
    visibility: true,
    rules: [],
  },
  available: {
    key: "available" as const,
    label: "En stock",
    initialValue: "",
    required: false,
    type: "text" as InputFieldType,
    visibility: true,
    helperText: "Cantidad en unidades",
    rules: [validationRules.number],
  },
  height: {
    key: "height" as const,
    label: "Altura",
    initialValue: "",
    required: false,
    type: "text" as InputFieldType,
    visibility: true,
    rules: [validationRules.number],
  },
  width: {
    key: "width" as const,
    label: "Diámetro maceta",
    initialValue: "",
    required: false,
    type: "text" as InputFieldType,
    visibility: true,
    rules: [validationRules.number],
  },
  comment: {
    key: "comment" as const,
    label: "Comentario",
    initialValue: "",
    required: false,
    type: "textarea" as InputFieldType,
    visibility: true,
    rules: [],
  },
  is_visible: {
    key: "is_visible" as const,
    label: "Visible en catálogo",
    initialValue: "",
    required: false,
    type: "boolean" as InputFieldType,
    visibility: true,
    rules: [],
  },
  images: {
    key: "images" as const,
    initialValue: [],
    required: false,
    type: "images" as InputFieldType,
    visibility: true,
    rules: [],
  },
} satisfies Record<string, DictEntry>;

export const AuthFormConfig = (form: { email?: string; password?: string }) => [
  { ...formConfigFieldsDict.email, initialValue: form.email ?? "" },
  { ...formConfigFieldsDict.password, initialValue: form.password ?? "" },
];

export const SignUpFormConfig = [
  formConfigFieldsDict.name,
  formConfigFieldsDict.email,
  formConfigFieldsDict.password,
  formConfigFieldsDict.confirm,
];

export const ResetPasswordFormConfig = (form: {
  password?: string;
  confirm?: string;
}) => [
  {
    ...formConfigFieldsDict.password,
    initialValue: form.password ?? "",
  },
  {
    ...formConfigFieldsDict.confirm,
    initialValue: form.confirm ?? "",
  },
];

export const AdminProductFormConfig = (
  product: ProductType | null,
): FormField<ProductForm>[] => [
  { ...formConfigFieldsDict.title, initialValue: product?.title ?? "" },
  { ...formConfigFieldsDict.price, initialValue: product?.price ?? "" },
  {
    ...formConfigFieldsDict.units_per_box,
    initialValue: product?.units_per_box ?? "",
  },
  { ...formConfigFieldsDict.available, initialValue: product?.available ?? "" },
  { ...formConfigFieldsDict.width, initialValue: product?.width ?? "" },
  { ...formConfigFieldsDict.height, initialValue: product?.height ?? "" },
  { ...formConfigFieldsDict.comment, initialValue: product?.comment ?? "" },
  {
    ...formConfigFieldsDict.can_buy_units,
    initialValue: product?.can_buy_units ?? false,
  },
  {
    ...formConfigFieldsDict.is_visible,
    initialValue: product?.is_visible ?? true,
  },
  { ...formConfigFieldsDict.images, initialValue: product?.images ?? [] },
];
