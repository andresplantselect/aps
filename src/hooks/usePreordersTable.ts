'use client';

import { useMediaQuery, useTheme } from '@mui/material';
import { startOfDay, endOfDay } from 'date-fns';
import { useCallback, useMemo, useState, useEffect } from 'react';

import { useAuth } from '@/src/context/AuthContext';
import { useOrders } from '@/src/context/OrdersContext';
import {
  DeliveryStatusType,
  OrderStatusType,
  OrderType,
  ViewModeType,
} from '@/src/types/types';

export const isOrderCompleted = (order: OrderType) =>
  order.status === 'cancelled' ||
  order.delivery_status === 'delivered' ||
  order.delivery_status === 'failed';

export const usePreordersTable = () => {
  const { orders, isOrdersLoading } = useOrders();
  const { isAdmin } = useAuth();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [statusFilter, setStatusFilter] = useState<OrderStatusType[]>([]);
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<
    DeliveryStatusType[]
  >([]);

  const [userFilter, setUserFilter] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<
    'date' | 'status' | 'user' | 'delivery_status'
  >('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewModeType>(
    isAdmin ? (isDesktop ? 'table' : 'cards') : 'cards',
  );
  const [showHistory, setShowHistory] = useState(false);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [dateFrom, dateTo] = dateRange;

  useEffect(() => {
    setPage(0);
  }, [statusFilter, deliveryStatusFilter, userFilter, dateFrom, dateTo]);

  const toggleExpand = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const statusOk =
        statusFilter.length === 0 || statusFilter.includes(order.status);
      const deliveryStatusOk =
        deliveryStatusFilter.length === 0 ||
        deliveryStatusFilter.includes(order.delivery_status);

      const userOk =
        !isAdmin ||
        userFilter.length === 0 ||
        userFilter.includes(order.profile_name ?? '');

      const orderDate = new Date(order.created_at);

      const dateFromOk = !dateFrom || orderDate >= startOfDay(dateFrom);
      const dateToOk = !dateTo || orderDate <= endOfDay(dateTo);

      return statusOk && deliveryStatusOk && userOk && dateFromOk && dateToOk;
    });
  }, [
    orders,
    statusFilter,
    deliveryStatusFilter,
    userFilter,
    isAdmin,
    dateFrom,
    dateTo,
  ]);

  const activeOrders = useMemo(
    () => filteredOrders.filter((order) => !isOrderCompleted(order)),
    [filteredOrders],
  );

  const historyOrders = useMemo(
    () => filteredOrders.filter(isOrderCompleted),
    [filteredOrders],
  );

  const users = useMemo(() => {
    const set = new Set<string>();

    orders.forEach((o) => {
      if (o.profile_name) set.add(o.profile_name);
    });

    return [...set].sort((a, b) => a.localeCompare(b));
  }, [orders]);

  const compareOrders = useCallback(
    (a: OrderType, b: OrderType) => {
      if (sortBy === 'date') {
        return sortDir === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }

      switch (sortBy) {
        case 'status':
          return sortDir === 'asc'
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);

        case 'delivery_status':
          return sortDir === 'asc'
            ? a.delivery_status.localeCompare(b.delivery_status)
            : b.delivery_status.localeCompare(a.delivery_status);

        case 'user':
          return sortDir === 'asc'
            ? (a.profile_name || '').localeCompare(b.profile_name || '')
            : (b.profile_name || '').localeCompare(a.profile_name || '');

        default:
          return 0;
      }
    },
    [sortBy, sortDir],
  );

  const sortedOrders = useMemo(
    () => [...activeOrders].sort(compareOrders),
    [activeOrders, compareOrders],
  );

  const sortedHistoryOrders = useMemo(
    () => [...historyOrders].sort(compareOrders),
    [historyOrders, compareOrders],
  );

  const allSortedOrders = useMemo(
    () => [...filteredOrders].sort(compareOrders),
    [filteredOrders, compareOrders],
  );

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedOrders.slice(start, start + rowsPerPage);
  }, [sortedOrders, page, rowsPerPage]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  return {
    users,
    paginated,
    sortedOrders,
    sortedHistoryOrders,
    allSortedOrders,
    showHistory,
    toggleHistory: () => setShowHistory((prev) => !prev),
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    sortBy,
    sortDir,
    toggleSort,
    expandedOrderId,
    toggleExpand,
    isOrdersLoading,
    viewMode,
    setViewMode,
    filters: {
      deliveryStatusFilter,
      statusFilter,
      userFilter,
      dateRange,
    },
    setFilters: {
      setDeliveryStatusFilter,
      setStatusFilter,
      setUserFilter,
      setDateRange,
    },
  };
};
