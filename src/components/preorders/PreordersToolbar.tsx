'use client';

import DownloadIcon from '@mui/icons-material/Download';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import { Stack } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';

import { ViewToggle } from '@/src/components/common/ViewToggle';
import { PreordersFilters } from '@/src/components/preorders/PreordersFilters';
import { useAuth } from '@/src/context/AuthContext';
import { usePreordersContext } from '@/src/context/PreordersContext';
import { exportOrdersToExcel } from '@/src/helpers/exportToExcel';
import { SecondaryButton, PrimaryButton } from '@/src/styledComponents';

export function PreordersToolbar() {
  const [showFilters, setShowFilters] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { sortedOrders, viewMode, setViewMode } = usePreordersContext();
  const { isAdmin } = useAuth();

  return (
    <Stack spacing={2} mb={2}>
      <Stack direction="row" justifyContent="space-between">
        {isAdmin && (
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        )}

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<TuneIcon fontSize="small" />}
            endIcon={
              showFilters ? (
                <ExpandLessOutlinedIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )
            }
          >
            Filtros
          </SecondaryButton>

          {isAdmin && isDesktop && (
            <PrimaryButton
              endIcon={<DownloadIcon />}
              onClick={() => exportOrdersToExcel(sortedOrders)}
            >
              Descargar Excel
            </PrimaryButton>
          )}
        </Stack>
      </Stack>
      {showFilters && <PreordersFilters />}
    </Stack>
  );
}
