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
import { availabilityStatusesDict } from '@/src/constants';
import { ProductsFiltersProps } from '@/src/types/propsTypes';

export function ProductsFilters({
  availabilityFilter,
  onAvailabilityChange,
  searchFilter,
  onSearchChange,
}: ProductsFiltersProps) {
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <OutlinedInput
        size="small"
        value={searchFilter}
        placeholder="Buscar articulos"
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ width: { xs: '100%', md: '350px' }, borderRadius: 12 }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        endAdornment={
          searchFilter ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => onSearchChange('')}
                edge="end"
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ) : null
        }
      />

      <FilterSelect
        label="Disponibilidad"
        value={availabilityFilter}
        options={availabilityStatusesDict}
        onChange={onAvailabilityChange}
      />
    </Stack>
  );
}
