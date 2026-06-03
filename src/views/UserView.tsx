'use client';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Fab, Badge } from '@mui/material';
import { useState } from 'react';

import { useCart } from '@/src/context/CartContext';
import CartPanelView from '@/src/views/CartPanelView';
import UsersTabs from '@/src/views/UsersTabs';

export default function UserView() {
  const [cartOpen, setCartOpen] = useState(false);

  const { items } = useCart();

  const totalItems = items.length;

  const handleToggleCart = () => setCartOpen((prev) => !prev);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <UsersTabs />

      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: { xs: 72, md: 16 },
          right: 16,
          zIndex: 1000,
        }}
        onClick={handleToggleCart}
      >
        <Badge
          badgeContent={totalItems}
          color="error"
          invisible={totalItems === 0}
          sx={{
            '& .MuiBadge-badge': {
              top: -8,
              right: -8,
            },
          }}
        >
          <ShoppingCartIcon />
        </Badge>
      </Fab>

      {cartOpen && <CartPanelView open={cartOpen} onClose={handleToggleCart} />}
    </Box>
  );
}
