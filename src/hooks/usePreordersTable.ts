'use client';

import { startOfDay, endOfDay } from 'date-fns';
import { useMemo, useState, useEffect } from 'react';

import { useAuth } from '@/src/context/AuthContext';
import { useOrders } from '@/src/context/OrdersContext';
import { DeliveryStatusType, OrderStatusType } from '@/src/types/types';

export const usePreordersTable = () => {
  const { orders, isOrdersLoading } = useOrders();
  const { isAdmin } = useAuth();

  const [statusFilter, setStatusFilter] = useState<OrderStatusType | 'all'>(
    'all',
  );
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<
    DeliveryStatusType | 'all'
  >('all');

  const [userFilter, setUserFilter] = useState('all');

  const [sortBy, setSortBy] = useState<
    'date' | 'status' | 'user' | 'delivery_status'
  >('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

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
      const statusOk = statusFilter === 'all' || order.status === statusFilter;
      const deliveryStatusOk =
        deliveryStatusFilter === 'all' ||
        order.delivery_status === deliveryStatusFilter;

      const userOk =
        !isAdmin || userFilter === 'all' || order.profile_name === userFilter;

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

  const users = useMemo(() => {
    const set = new Set<string>();

    orders.forEach((o) => {
      if (o.profile_name) set.add(o.profile_name);
    });

    return [...set].sort((a, b) => a.localeCompare(b));
  }, [orders]);

  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders];

    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortDir === 'asc'
            ? new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime();

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
    });

    return sorted;
  }, [filteredOrders, sortBy, sortDir]);

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
