'use client';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Stack } from '@mui/material';
import { useState } from 'react';

import { CartItemsList } from '@/src/components/cart/CartItemsList';
import { CartItemSummary } from '@/src/components/cart/CartItemSummary';
import { AppDrawer } from '@/src/components/common/AppDrawer';
import { TITLES } from '@/src/constants';
import { useAlert } from '@/src/context/AlertContext';
import { useCart } from '@/src/context/CartContext';
import { useOrders } from '@/src/context/OrdersContext';
import { useCreateOrder } from '@/src/hooks/api';
import { CartPanelProps } from '@/src/types/propsTypes';

export default function CartPanelView({ open, onClose }: CartPanelProps) {
  const [comment, setComment] = useState('');

  const { items, total, clearCart } = useCart();
  const { createOrder } = useCreateOrder();
  const { showAlert } = useAlert();
  const { refreshOrders } = useOrders();

  const isCartEmpty = items.length === 0;

  const handleSubmit = async () => {
    const orderItems = items.map((i) => ({
      product_id: i.id,
      title: i.title,
      price: i.price,
      quantity: i.quantity,
      can_buy_units: i.can_buy_units,
      units_per_box: i.units_per_box,
    }));

    const { success, error } = await createOrder(orderItems, total, comment);

    if (error) {
      showAlert(error);
      return;
    }

    if (success) {
      showAlert(success);
      await refreshOrders();
    }

    clearCart();
    setComment('');
    onClose();
  };

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      title={TITLES.titles.cart}
      icon={<ShoppingCartIcon />}
      primaryButton={{
        title: TITLES.buttons.cart.submit,
        handleSubmit,
        disabled: isCartEmpty,
      }}
      secondaryButton={{
        title: TITLES.buttons.cart.clear,
        handleSubmit: clearCart,
        disabled: isCartEmpty,
      }}
    >
      <Stack justifyContent="space-between" sx={{ height: '100%' }}>
        <CartItemsList items={items} />

        {!isCartEmpty && (
          <CartItemSummary
            total={total}
            comment={comment}
            setComment={setComment}
          />
        )}
      </Stack>
    </AppDrawer>
  );
}
