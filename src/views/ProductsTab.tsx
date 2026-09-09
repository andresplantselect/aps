import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import {
  Box,
  IconButton,
  InputAdornment,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';

import EmptyStateMessage from '@/src/components/common/EmptyStateMessage';
import { ViewToggle } from '@/src/components/common/ViewToggle';
import { ProductsBulkDeleteDialog } from '@/src/components/products/ProductsBulkDeleteDialog';
import { ProductsFilters } from '@/src/components/products/ProductsFilters';
import ProductsPage from '@/src/components/products/ProductsPage';
import { useAlert } from '@/src/context/AlertContext';
import { useAuth } from '@/src/context/AuthContext';
import { readProductFormDraft } from '@/src/helpers/productFormDraft';
import { useHideOutOfStockProducts } from '@/src/hooks/api';
import { useProductsState } from '@/src/hooks/useProductsState';
import {
  PrimaryButton,
  SecondaryButton,
  SecondaryRoundIconButton,
} from '@/src/styledComponents';
import AdminProductFormView from '@/src/views/AdminProductFormView';

export default function ProductsTab() {
  const [showForm, setShowForm] = useState(
    () => readProductFormDraft()?.mode === 'create',
  );
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [actionsAnchorEl, setActionsAnchorEl] = useState<HTMLElement | null>(
    null,
  );

  const { isAdmin } = useAuth();
  const { showAlert } = useAlert();
  const { hideOutOfStockProducts } = useHideOutOfStockProducts();
  const productsState = useProductsState();
  const { searchTerm, setSearchTerm } = productsState;

  const handleHideOutOfStock = async () => {
    setActionsAnchorEl(null);
    const { error, success } = await hideOutOfStockProducts();

    if (error) showAlert(error);
    else if (success) showAlert(success);
  };

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

                  <SecondaryRoundIconButton
                    onClick={(e) => setActionsAnchorEl(e.currentTarget)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </SecondaryRoundIconButton>

                  <Menu
                    anchorEl={actionsAnchorEl}
                    open={Boolean(actionsAnchorEl)}
                    onClose={() => setActionsAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem onClick={handleHideOutOfStock}>
                      <ListItemIcon>
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Ocultar sin stock</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setActionsAnchorEl(null);
                        setShowBulkDelete(true);
                      }}
                    >
                      <ListItemIcon>
                        <DeleteSweepOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Eliminar varios</ListItemText>
                    </MenuItem>
                  </Menu>

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

      {showBulkDelete && (
        <ProductsBulkDeleteDialog
          open={showBulkDelete}
          onClose={() => setShowBulkDelete(false)}
        />
      )}
    </Box>
  );
}
