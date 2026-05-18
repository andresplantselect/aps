import CloseIcon from '@mui/icons-material/Close';
import { Button, Stack } from '@mui/material';
import { any, isNotNil } from 'ramda';

import { DateRangePicker } from '@/src/components/common/DateRangePicker';
import { FilterSelect } from '@/src/components/common/FilterSelect';
import { deliveryStatusesDict, orderStatusesDict } from '@/src/constants';
import { useAuth } from '@/src/context/AuthContext';
import { usePreordersContext } from '@/src/context/PreordersContext';

export function PreordersFilters() {
  const { isAdmin } = useAuth();
  const { filters, setFilters, users } = usePreordersContext();
  const { statusFilter, userFilter, dateRange, deliveryStatusFilter } = filters;
  const {
    setStatusFilter,
    setUserFilter,
    setDateRange,
    setDeliveryStatusFilter,
  } = setFilters;

  const isAnyDatePicked = any(isNotNil, dateRange);

  return (
    <Stack spacing={1}>
      <FilterSelect
        label="Estado"
        value={statusFilter}
        options={orderStatusesDict}
        onChange={(v) => setStatusFilter(v)}
      />

      <FilterSelect
        label="Estado de entrega"
        value={deliveryStatusFilter}
        options={deliveryStatusesDict}
        onChange={(v) => setDeliveryStatusFilter(v)}
      />

      {isAdmin && (
        <FilterSelect
          label="Usuario"
          value={userFilter}
          options={Object.fromEntries(users.map((u) => [u, u]))}
          onChange={(v) => setUserFilter(v)}
        />
      )}

      <Stack direction="row">
        <DateRangePicker value={dateRange} onChange={(v) => setDateRange(v)} />
        {isAnyDatePicked && (
          <Button onClick={() => setDateRange([null, null])}>
            <CloseIcon />
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
