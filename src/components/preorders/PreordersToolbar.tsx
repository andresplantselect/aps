'use client';

import DownloadIcon from '@mui/icons-material/Download';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
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
  const { allSortedOrders, showHistory, toggleHistory, viewMode, setViewMode } =
    usePreordersContext();
  const { isAdmin } = useAuth();

  return (
    <Stack spacing={2} mb={3}>
      <Stack
        direction={isDesktop ? 'row' : 'column'}
        justifyContent="space-between"
        spacing={2}
      >
        {isAdmin && (
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        )}

        <Stack
          direction="row"
          justifyContent={isDesktop ? 'flex-end' : 'flex-start'}
          spacing={2}
        >
          <SecondaryButton
            onClick={toggleHistory}
            startIcon={<HistoryIcon fontSize="small" />}
            endIcon={
              showHistory ? (
                <ExpandLessOutlinedIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )
            }
          >
            Historial
          </SecondaryButton>

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
              onClick={() => exportOrdersToExcel(allSortedOrders)}
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
