'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';

import { supabase } from '@/lib/supabase';
import { ProductType } from '@/src/types/types';

interface ProductsContextType {
  products: ProductType[];
  isProductsLoading: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  isProductsLoading: true,
  refreshProducts: async () => {},
});

export const useProducts = () => useContext(ProductsContext);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isProductsLoading, setIsProductLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setIsProductLoading(true);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } else {
      const productsData = data
        ? data.map((p) => ({ ...p, price: p.price.toFixed(2) }))
        : [];
      setProducts(productsData);
    }
    setIsProductLoading(false);
  }, []);

  useEffect(() => {
    void fetchProducts();

    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          setProducts((prev) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [payload.new as ProductType, ...prev];

              case 'UPDATE':
                return prev.map((p) =>
                  p.id === payload.new.id ? (payload.new as ProductType) : p,
                );

              case 'DELETE':
                return prev.filter((p) => p.id !== payload.old.id);

              default:
                return prev;
            }
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        isProductsLoading,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
