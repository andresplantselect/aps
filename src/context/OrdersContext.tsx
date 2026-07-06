'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/src/context/AuthContext';
import { OrdersContextType } from '@/src/types/propsTypes';
import { OrderType } from '@/src/types/types';

const OrdersContext = createContext<OrdersContextType>({
  orders: [],
  isOrdersLoading: true,
  refreshOrders: async () => {},
});

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const { userId, isAdmin } = useAuth();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (!userId) {
      setOrders([]);
      setIsOrdersLoading(false);
      return;
    }

    setIsOrdersLoading(true);

    try {
      let query = supabase
        .from('orders_with_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isAdmin) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
        return;
      }

      setOrders((data ?? []) as OrderType[]);
    } finally {
      setIsOrdersLoading(false);
    }
  }, [userId, isAdmin]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          void loadOrders();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadOrders]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        isOrdersLoading,
        refreshOrders: loadOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
