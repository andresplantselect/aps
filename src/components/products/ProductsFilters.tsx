'use client';

import { Stack } from '@mui/material';
import React from 'react';

import { FilterSelect } from '@/src/components/common/FilterSelect';
import {
  availabilityStatusesDict,
  visibilityStatusesDict,
} from '@/src/constants';
import { UseProductsStateProps } from '@/src/types/propsTypes';

export function ProductsFilters({
  availabilityFilter,
  setAvailabilityFilter,
  visibilityFilter,
  setVisibilityFilter,
}: UseProductsStateProps) {
  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
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
    </Stack>
  );
}
