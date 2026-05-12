import { validationRules } from "@/src/helpers/validators";
import { ProductForm } from "@/src/types/propsTypes";
import { AnyFormField, FormField, ProductType } from "@/src/types/types";

const formConfigFieldsDict: Record<string, AnyFormField> = {
  name: {
    key: "name",
    label: "Nombre",
    initialValue: "",
    required: true,
    type: "text",
    visibility: true,
    rules: [validationRules.required],
  },
  email: {
    key: "email",
    label: "Correo electrónico",
    initialValue: "",
    required: true,
    type: "text",
    visibility: true,
    rules: [validationRules.required, validationRules.email],
  },
  password: {
    key: "password",
    initialValue: "",
    required: true,
    type: "password",
    visibility: true,
    rules: [validationRules.required, validationRules.password],
  },
  confirm: {
    key: "confirm",
    initialValue: "",
    required: true,
    type: "confirm",
    visibility: true,
    rules: [validationRules.required, validationRules.confirmPassword],
  },
  title: {
    key: "title",
    label: "Título",
    initialValue: "",
    required: true,
    type: "text",
    visibility: true,
    rules: [validationRules.required],
  },
  price: {
    key: "price",
    label: "Precio",
    initialValue: "",
    required: true,
    type: "number",
    visibility: true,
    rules: [validationRules.required],
    inputProps: {
      step: 0.05,
      inputMode: "decimal",
    },
  },
  units_per_box: {
    key: "units_per_box",
    label: "Unidades por caja",
    initialValue: "",
    required: true,
    type: "number",
    visibility: true,
    rules: [validationRules.required],
    inputProps: {
      step: 1,
    },
  },
  can_buy_units: {
    key: "can_buy_units",
    label: "Permitir compra por unidades",
    initialValue: false,
    required: false,
    type: "boolean",
    visibility: true,
    rules: [],
  },
  available: {
    key: "available",
    label: "En stock",
    initialValue: "",
    required: true,
    type: "number",
    visibility: true,
    rules: [validationRules.required],
    inputProps: {
      step: 1,
    },
  },
  height: {
    key: "height",
    label: "Altura",
    initialValue: "",
    required: false,
    type: "number",
    visibility: true,
    rules: [],
    inputProps: {
      step: 1,
    },
  },
  width: {
    key: "width",
    label: "Diámetro maceta",
    initialValue: "",
    required: false,
    type: "number",
    visibility: true,
    rules: [],
    inputProps: {
      step: 1,
    },
  },
  comment: {
    key: "comment",
    label: "Comentario",
    initialValue: "",
    required: false,
    type: "textarea",
    visibility: true,
    rules: [],
  },
  images: {
    key: "images",
    initialValue: [],
    required: false,
    type: "images",
    visibility: true,
    rules: [],
  },
};

export const AuthFormConfig = [
  formConfigFieldsDict.email,
  formConfigFieldsDict.password,
];

export const SignUpFormConfig = [
  formConfigFieldsDict.name,
  formConfigFieldsDict.email,
  formConfigFieldsDict.password,
  formConfigFieldsDict.confirm,
];

export const RequestResetPasswordFormConfig = [formConfigFieldsDict.email];

export const ResetPasswordFormConfig = [
  formConfigFieldsDict.password,
  formConfigFieldsDict.confirm,
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
  {
    ...formConfigFieldsDict.can_buy_units,
    initialValue: product?.can_buy_units ?? false,
  },
  { ...formConfigFieldsDict.available, initialValue: product?.available ?? "" },
  { ...formConfigFieldsDict.width, initialValue: product?.width ?? "" },
  { ...formConfigFieldsDict.height, initialValue: product?.height ?? "" },
  { ...formConfigFieldsDict.comment, initialValue: product?.comment ?? "" },
  { ...formConfigFieldsDict.images, initialValue: product?.images ?? [] },
];
