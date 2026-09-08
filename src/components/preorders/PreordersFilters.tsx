import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton, Stack, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { any, isNotNil } from 'ramda';

import { FilterCheckboxGroup } from '@/src/components/common/FilterCheckboxGroup';
import { deliveryStatusesDict, orderStatusesDict } from '@/src/constants';
import { useAuth } from '@/src/context/AuthContext';
import { usePreordersContext } from '@/src/context/PreordersContext';
import { FiltersBox, LinkButton } from '@/src/styledComponents';
import { DeliveryStatusType, OrderStatusType } from '@/src/types/types';

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

  const [from, to] = dateRange;
  const isAnyDatePicked = any(isNotNil, dateRange);

  const hasAnyFilter =
    statusFilter.length > 0 ||
    deliveryStatusFilter.length > 0 ||
    userFilter.length > 0 ||
    dateRange.some(Boolean);

  const clearAllFilters = () => {
    setStatusFilter([]);
    setDeliveryStatusFilter([]);
    setUserFilter([]);
    setDateRange([null, null]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FiltersBox data-testid="preorders-filters">
        <LinkButton
          onClick={clearAllFilters}
          disabled={!hasAnyFilter}
          sx={{ alignSelf: 'flex-end' }}
        >
          Limpiar filtros
        </LinkButton>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, md: 5 }}
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: 'none', md: 'block' } }}
            />
          }
        >
          <FilterCheckboxGroup<OrderStatusType>
            label="Estado"
            value={statusFilter}
            options={orderStatusesDict}
            onChange={(v) => setStatusFilter(v)}
          />

          <FilterCheckboxGroup<DeliveryStatusType>
            label="Estado de entrega"
            value={deliveryStatusFilter}
            options={deliveryStatusesDict}
            onChange={(v) => setDeliveryStatusFilter(v)}
          />

          {isAdmin && users.length > 0 && (
            <FilterCheckboxGroup<string>
              label="Usuario"
              value={userFilter}
              options={Object.fromEntries(users.map((u) => [u, u]))}
              onChange={(v) => setUserFilter(v)}
            />
          )}

          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                Rango de fechas
              </Typography>
              {isAnyDatePicked && (
                <IconButton
                  size="small"
                  onClick={() => setDateRange([null, null])}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Stack>
            <Stack spacing={1}>
              <DatePicker
                format="dd/MM/yyyy"
                label="Desde"
                value={from}
                onChange={(d) => setDateRange([d, to])}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                format="dd/MM/yyyy"
                label="Hasta"
                value={to}
                minDate={from ?? undefined}
                onChange={(d) => setDateRange([from, d])}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Stack>
          </Stack>
        </Stack>
      </FiltersBox>
    </LocalizationProvider>
  );
}
