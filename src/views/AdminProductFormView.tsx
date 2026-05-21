'use client';

import GrassIcon from '@mui/icons-material/Grass';
import React, { useMemo, useState } from 'react';

import { AppDrawer } from '@/src/components/common/AppDrawer';
import CommonForm from '@/src/components/form/CommonForm';
import { AdminProductFormConfig } from '@/src/components/form/formConfigs';
import { useAlert } from '@/src/context/AlertContext';
import { parseNumberInput } from '@/src/helpers/helpers';
import { useCreateProduct, useUpdateProduct } from '@/src/hooks/api';
import { AdminProductFormProps, ProductForm } from '@/src/types/propsTypes';
import { FormField } from '@/src/types/types';

export default function AdminProductFormView({
  open,
  onClose,
  product = null,
}: AdminProductFormProps) {
  const isEdit = !!product;

  const [productForm, setProductForm] = useState<ProductForm>({
    title: '',
    price: '',
    comment: '',
    units_per_box: '',
    images: [],
    available: '',
    height: '',
    width: '',
    can_buy_units: false,
    is_visible: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const { showAlert } = useAlert();

  const formConfig = useMemo(() => AdminProductFormConfig(product), [product]);
  const { createProduct } = useCreateProduct();
  const { updateProduct } = useUpdateProduct();

  const normalizedProduct = (form: ProductForm) => ({
    ...form,
    price: parseNumberInput(form.price) ?? '0',
    units_per_box: parseNumberInput(form.units_per_box) ?? '0',
    available: parseNumberInput(form.available) ?? '0',
  });

  const handleCreate = async () => {
    if (!isFormValid) return;

    const { error, success } = await createProduct(
      normalizedProduct(productForm),
    );

    if (error) {
      showAlert(error);
      return;
    }

    if (success) {
      showAlert(success);
    }
    onClose();
  };

  const handleUpdate = async () => {
    if (!isFormValid || !product?.id) return;

    const { error, success } = await updateProduct(
      normalizedProduct(productForm),
      product?.id,
    );

    if (error) {
      showAlert(error);
      return;
    }

    if (success) {
      showAlert(success);
    }
    onClose();
  };

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar articulo' : 'Agregar articulo'}
      icon={<GrassIcon />}
      primaryButton={{
        title: isEdit ? 'Guardar cambios' : 'Agregar',
        disabled: !isFormValid,
        handleSubmit: isEdit ? handleUpdate : handleCreate,
      }}
    >
      <CommonForm<ProductForm>
        fillForm={(form, isValid) => {
          setProductForm(form);
          setIsFormValid(isValid);
        }}
        formConfig={formConfig as FormField<ProductForm>[]}
      />
    </AppDrawer>
  );
}
