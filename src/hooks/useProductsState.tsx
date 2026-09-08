'use client';

import { useMediaQuery, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';

import { useAuth } from '@/src/context/AuthContext';
import { useProducts } from '@/src/context/ProductsContext';
import { UseProductsStateProps } from '@/src/types/propsTypes';
import type {
  DisponibilityType,
  ProductSortKey,
  VisibilityType,
  ViewModeType,
} from '@/src/types/types';

export function useProductsState(): UseProductsStateProps {
  const { products, isProductsLoading } = useProducts();
  const { isAdmin } = useAuth();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [availabilityFilter, setAvailabilityFilter] = useState<
    DisponibilityType[]
  >([]);
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityType[]>(
    [],
  );

  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy, setSortBy] = useState<ProductSortKey>('title');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const [viewMode, setViewMode] = useState<ViewModeType>(
    isAdmin ? (isDesktop ? 'table' : 'cards') : 'cards',
  );

  const toggleSort = (key: ProductSortKey) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const availabilityOk =
        availabilityFilter.length === 0 ||
        (availabilityFilter.includes('available') && product.available > 0) ||
        (availabilityFilter.includes('outOfStock') && product.available === 0);

      const visibilityOk =
        visibilityFilter.length === 0 ||
        (visibilityFilter.includes('visible') && product.is_visible) ||
        (visibilityFilter.includes('hidden') && !product.is_visible);

      const userAccessOk = isAdmin || product.is_visible;

      const searchOk = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return availabilityOk && visibilityOk && userAccessOk && searchOk;
    });

    return [...filtered].sort((a, b) => {
      let result = 0;

      if (sortBy === 'title') result = a.title.localeCompare(b.title);
      if (sortBy === 'price') result = a.price - b.price;
      if (sortBy === 'available') result = a.available - b.available;

      return sortDir === 'asc' ? result : -result;
    });
  }, [
    products,
    availabilityFilter,
    visibilityFilter,
    searchTerm,
    sortBy,
    sortDir,
    isAdmin,
  ]);

  const isProductListEmpty = visibleProducts.length === 0;

  return {
    isProductsLoading,

    visibleProducts,
    isProductListEmpty,

    availabilityFilter,
    setAvailabilityFilter,

    visibilityFilter,
    setVisibilityFilter,

    searchTerm,
    setSearchTerm,

    sortBy,
    sortDir,
    toggleSort,

    viewMode,
    setViewMode,
  };
}
