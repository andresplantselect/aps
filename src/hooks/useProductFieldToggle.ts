import { useState } from 'react';

import { useAlert } from '@/src/context/AlertContext';
import { useProducts } from '@/src/context/ProductsContext';
import { productToForm } from '@/src/helpers/productToForm';
import { useUpdateProduct } from '@/src/hooks/api';
import { ProductToggleField, ProductType } from '@/src/types/types';

export function useProductFieldToggle(
  product: ProductType,
  field: ProductToggleField,
) {
  const { showAlert } = useAlert();
  const { updateProduct } = useUpdateProduct();
  const { updateProductInState } = useProducts();

  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    setSaving(true);
    const form = { ...productToForm(product), [field]: !product[field] };
    const { error, data } = await updateProduct(form, product.id);
    setSaving(false);

    if (error) showAlert(error);
    else if (data) updateProductInState(data as unknown as ProductType);
  };

  return { toggle, saving };
}
