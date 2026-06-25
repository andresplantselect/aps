import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
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
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import EmptyStateMessage from '@/src/components/common/EmptyStateMessage';
import { ProductsFilters } from '@/src/components/products/ProductsFilters';
import ProductsPage from '@/src/components/products/ProductsPage';
import ProductsViewToggle from '@/src/components/products/ProductsViewToggle';
import { useAuth } from '@/src/context/AuthContext';
import { useProductsState } from '@/src/hooks/useProductsState';
import { PrimaryButton, SecondaryButton } from '@/src/styledComponents';
import AdminProductFormView from '@/src/views/AdminProductFormView';

export default function ProductsTab() {
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { isAdmin } = useAuth();
  const productsState = useProductsState();
  const { searchTerm, setSearchTerm } = productsState;

  return (
    <Box>
      <Stack spacing={1}>
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
            <Stack direction="row" justifyContent="space-between">
              <SecondaryButton
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<TuneIcon fontSize="small" />}
              >
                <Typography variant="body2" fontWeight={500}>
                  Filtros
                </Typography>
              </SecondaryButton>

              <PrimaryButton
                onClick={() => setShowForm(true)}
                endIcon={<AddIcon />}
              >
                Añadir
              </PrimaryButton>
            </Stack>
          )}

        {isAdmin && showFilters && <ProductsFilters {...productsState} />}
        {isAdmin && <ProductsViewToggle {...productsState} />}

        {!productsState.isProductsLoading &&
          productsState.isProductListEmpty && (
            <EmptyStateMessage
              message="No hay productos disponibles"
              icon={<YardOutlinedIcon />}
            />
          )}

        {productsState.isProductsLoading ? (
          <LinearProgress />
        ) : (
          <ProductsPage {...productsState} />
        )}
      </Stack>

      {showForm && (
        <AdminProductFormView
          open={showForm}
          onClose={() => setShowForm(false)}
        />
      )}
    </Box>
  );
}
