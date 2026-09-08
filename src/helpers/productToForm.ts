import { ProductForm } from '@/src/types/propsTypes';
import { ProductType } from '@/src/types/types';

export function productToForm(product: ProductType): ProductForm {
  return {
    title: product.title,
    price: product.price,
    comment: product.comment ?? '',
    units_per_box: product.units_per_box,
    images: product.images ?? [],
    available: product.available,
    height: product.height ?? '',
    width: product.width ?? '',
    can_buy_units: product.can_buy_units,
    is_visible: product.is_visible,
  };
}
