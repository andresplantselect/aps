'use client';

import { Box, Divider, Stack } from '@mui/material';
import React from 'react';

import { FilterCheckboxGroup } from '@/src/components/common/FilterCheckboxGroup';
import {
  availabilityStatusesDict,
  visibilityStatusesDict,
} from '@/src/constants';
import { UseProductsStateProps } from '@/src/types/propsTypes';
import { DisponibilityType, VisibilityType } from '@/src/types/types';

export function ProductsFilters({
  availabilityFilter,
  setAvailabilityFilter,
  visibilityFilter,
  setVisibilityFilter,
}: UseProductsStateProps) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        bgcolor: 'transparent',
        px: 2,
        py: 1.5,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: 'none', md: 'block' } }}
          />
        }
      >
        <FilterCheckboxGroup<DisponibilityType>
          label="Disponibilidad"
          value={availabilityFilter}
          options={availabilityStatusesDict}
          onChange={setAvailabilityFilter}
        />
        <FilterCheckboxGroup<VisibilityType>
          label="Visibilidad"
          value={visibilityFilter}
          options={visibilityStatusesDict}
          onChange={setVisibilityFilter}
        />
      </Stack>
    </Box>
  );
}
