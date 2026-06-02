import MenuIcon from '@mui/icons-material/Menu';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';

import UserMenu from '@/src/components/main/UserMenu';
import { SecondaryRoundIconButton } from '@/src/styledComponents';
import { HeaderActionsProps } from '@/src/types/propsTypes';

export default function HeaderActions({
  actions,
  name,
  onMobileMenuOpen,
}: HeaderActionsProps & { onMobileMenuOpen?: () => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleBurgerClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile && onMobileMenuOpen) {
      onMobileMenuOpen();
    } else {
      setAnchorEl(e.currentTarget);
    }
  };

  return (
    <Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        {!isMobile && (
          <Typography variant="body1" sx={{ color: 'primary.contrastText' }}>
            Hola, {name}!
          </Typography>
        )}

        <SecondaryRoundIconButton
          onClick={handleBurgerClick}
          sx={{
            color: 'primary.contrastText',
            borderColor: 'rgba(255,255,255,0.4)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'primary.contrastText',
            },
          }}
        >
          <MenuIcon sx={{ fontSize: 22 }} />
        </SecondaryRoundIconButton>
      </Stack>

      {!isMobile && (
        <UserMenu
          actions={actions}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
        />
      )}
    </Stack>
  );
}
