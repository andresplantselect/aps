'use client';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Stack,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import React from 'react';

import { FilterSelect } from '@/src/components/common/FilterSelect';
import {
  availabilityStatusesDict,
  visibilityStatusesDict,
} from '@/src/constants';
import { useAuth } from '@/src/context/AuthContext';
import { UseProductsStateProps } from '@/src/types/propsTypes';

export function ProductsFilters({
  searchTerm,
  setSearchTerm,
  availabilityFilter,
  setAvailabilityFilter,
  visibilityFilter,
  setVisibilityFilter,
}: UseProductsStateProps) {
  const { isAdmin } = useAuth();

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <OutlinedInput
        size="small"
        value={searchTerm}
        placeholder="Buscar articulos"
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ width: { xs: '100%', md: '350px' }, borderRadius: 12 }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        endAdornment={
          searchTerm ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setSearchTerm('')}
                edge="end"
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ) : null
        }
      />

      {isAdmin && (
        <>
          <FilterSelect
            label="Disponibilidad"
            value={availabilityFilter}
            options={availabilityStatusesDict}
            onChange={setAvailabilityFilter}
          />
          <FilterSelect
            label="Visibilidad"
            value={visibilityFilter}
            options={visibilityStatusesDict}
            onChange={setVisibilityFilter}
          />
        </>
      )}
    </Stack>
  );
}
