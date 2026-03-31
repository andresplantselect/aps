import MenuIcon from '@mui/icons-material/Menu';
import { Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

import UserMenu from '@/src/components/main/UserMenu';
import { SecondaryRoundIconButton } from '@/src/styledComponents';
import { HeaderActionsProps } from '@/src/types/propsTypes';

export default function HeaderActions({ actions, name }: HeaderActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body1" color="primary">
          Hola, {name}!
        </Typography>

        <SecondaryRoundIconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MenuIcon fontSize="small" />
        </SecondaryRoundIconButton>
      </Stack>

      <UserMenu
        actions={actions}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      />
    </Stack>
  );
}
