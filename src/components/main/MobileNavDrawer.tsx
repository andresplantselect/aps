'use client';

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Stack,
} from '@mui/material';
import React from 'react';

import { MenuAction } from '@/src/types/types';

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  actions: MenuAction[];
  name: string;
}

export default function MobileNavDrawer({
  open,
  onClose,
  actions,
  name,
}: MobileNavDrawerProps) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Stack sx={{ width: 260, pt: 3, pb: 2 }}>
        <Typography
          sx={{
            px: 2,
            pb: 2,
            fontWeight: 600,
            fontSize: 15,
            color: 'primary.main',
          }}
        >
          Hola, {name}!
        </Typography>

        <Divider />

        <List disablePadding>
          {actions
            .filter(({ visibility }) => visibility)
            .map(({ value, label, icon, onClick }) => (
              <ListItemButton
                key={value}
                onClick={() => {
                  onClick();
                  onClose();
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
        </List>
      </Stack>
    </Drawer>
  );
}
