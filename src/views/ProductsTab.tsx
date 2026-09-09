import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import {
  Box,
  IconButton,
  InputAdornment,
  LinearProgress,
  OutlinedInput,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';

import EmptyStateMessage from '@/src/components/common/EmptyStateMessage';
import { ViewToggle } from '@/src/components/common/ViewToggle';
import { ProductsFilters } from '@/src/components/products/ProductsFilters';
import ProductsPage from '@/src/components/products/ProductsPage';
import { useAuth } from '@/src/context/AuthContext';
import { readProductFormDraft } from '@/src/helpers/productFormDraft';
import { useProductsState } from '@/src/hooks/useProductsState';
import { PrimaryButton, SecondaryButton } from '@/src/styledComponents';
import AdminProductFormView from '@/src/views/AdminProductFormView';

export default function ProductsTab() {
  const [showForm, setShowForm] = useState(
    () => readProductFormDraft()?.mode === 'create',
  );
  const [showFilters, setShowFilters] = useState(false);

  const { isAdmin } = useAuth();
  const productsState = useProductsState();
  const { searchTerm, setSearchTerm } = productsState;

  return (
    <Box>
      <Stack spacing={2} mb={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
        >
          {isAdmin && (
            <ViewToggle
              viewMode={productsState.viewMode}
              setViewMode={productsState.setViewMode}
            />
          )}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems="flex-start"
          >
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

            <Stack
              alignItems={{ xs: 'flex-start', md: 'flex-end' }}
              spacing={1}
            >
              {isAdmin && (
                <Stack direction="row" spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
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
                  </Stack>

                  <PrimaryButton
                    onClick={() => setShowForm(true)}
                    endIcon={<AddIcon />}
                  >
                    Añadir
                  </PrimaryButton>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>

        {isAdmin && showFilters && <ProductsFilters {...productsState} />}
      </Stack>

      {productsState.isProductsLoading ? (
        <LinearProgress />
      ) : productsState.isProductListEmpty ? (
        <EmptyStateMessage
          message="No hay productos disponibles"
          icon={<YardOutlinedIcon />}
        />
      ) : (
        <ProductsPage {...productsState} />
      )}

      {showForm && (
        <AdminProductFormView
          open={showForm}
          onClose={() => setShowForm(false)}
        />
      )}
    </Box>
  );
}
