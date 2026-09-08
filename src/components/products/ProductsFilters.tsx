'use client';

import { Divider, Stack } from '@mui/material';
import React from 'react';

import { FilterCheckboxGroup } from '@/src/components/common/FilterCheckboxGroup';
import {
  availabilityStatusesDict,
  visibilityStatusesDict,
} from '@/src/constants';
import { FiltersBox, LinkButton } from '@/src/styledComponents';
import { UseProductsStateProps } from '@/src/types/propsTypes';
import { DisponibilityType, VisibilityType } from '@/src/types/types';

export function ProductsFilters({
  availabilityFilter,
  setAvailabilityFilter,
  visibilityFilter,
  setVisibilityFilter,
}: UseProductsStateProps) {
  const hasAnyFilter =
    availabilityFilter.length > 0 || visibilityFilter.length > 0;
  const clearAllFilters = () => {
    setAvailabilityFilter([]);
    setVisibilityFilter([]);
  };
  return (
    <FiltersBox data-testid="products-filters">
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
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
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
    </FiltersBox>
  );
}
