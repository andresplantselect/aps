import React, { ReactNode } from 'react';

import { AlertProvider } from '@/src/context/AlertContext';
import { AuthProvider } from '@/src/context/AuthContext';
import { CartProvider } from '@/src/context/CartContext';
import { OrdersProvider } from '@/src/context/OrdersContext';
import { ProductsProvider } from '@/src/context/ProductsContext';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AlertProvider>
        <ProductsProvider>
          <OrdersProvider>
            <CartProvider>{children}</CartProvider>
          </OrdersProvider>
        </ProductsProvider>
      </AlertProvider>
    </AuthProvider>
  );
}
