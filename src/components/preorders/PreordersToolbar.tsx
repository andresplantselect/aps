'use client';

import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TableViewIcon from '@mui/icons-material/TableView';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Stack,
  Typography,
  ToggleButtonGroup,
  IconButton,
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';

import { PreordersFilters } from '@/src/components/preorders/PreordersFilters';
import { useAuth } from '@/src/context/AuthContext';
import { usePreordersContext } from '@/src/context/PreordersContext';
import { exportOrdersToExcel } from '@/src/helpers/exportToExcel';
import {
  SecondaryButton,
  PrimaryButton,
  TogglePillButton,
} from '@/src/styledComponents';

export function PreordersToolbar() {
  const [showFilters, setShowFilters] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { sortedOrders, viewMode, setViewMode, filters, setFilters } =
    usePreordersContext();
  const { isAdmin } = useAuth();

  const { statusFilter, deliveryStatusFilter, userFilter, dateRange } = filters;
  const {
    setStatusFilter,
    setDeliveryStatusFilter,
    setUserFilter,
    setDateRange,
  } = setFilters;

  const hasAnyFilter =
    statusFilter.length > 0 ||
    deliveryStatusFilter.length > 0 ||
    userFilter.length > 0 ||
    dateRange.some(Boolean);

  const clearAll = () => {
    setStatusFilter([]);
    setDeliveryStatusFilter([]);
    setUserFilter([]);
    setDateRange([null, null]);
  };

  return (
    <Stack spacing={2} mb={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<TuneIcon fontSize="small" />}
          >
            <Typography variant="body2" fontWeight={500}>
              Filtros
            </Typography>
          </SecondaryButton>
          {hasAnyFilter && (
            <IconButton size="small" onClick={clearAll}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        {isAdmin && isDesktop && (
          <PrimaryButton
            endIcon={<DownloadIcon />}
            onClick={() => exportOrdersToExcel(sortedOrders)}
          >
            Descargar Excel
          </PrimaryButton>
        )}
      </Stack>

      {showFilters && <PreordersFilters />}

      {isAdmin && (
        <ToggleButtonGroup
          size="small"
          value={viewMode}
          exclusive
          onChange={(_, v) => v && setViewMode(v)}
        >
          <TogglePillButton value="table">
            <TableViewIcon fontSize="small" />
          </TogglePillButton>
          <TogglePillButton value="cards">
            <DragIndicatorIcon fontSize="small" />
          </TogglePillButton>
        </ToggleButtonGroup>
      )}
    </Stack>
  );
}
