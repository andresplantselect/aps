'use client';

import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import {
  Box,
  Tabs,
  Tab,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import * as R from 'ramda';
import React, { JSX, useState, ReactNode } from 'react';

import { useAuth } from '@/src/context/AuthContext';
import ImagesTab from '@/src/views/ImagesTab';
import PreordersTab from '@/src/views/PreordersTab';
import ProductsTab from '@/src/views/ProductsTab';

export interface TabItem {
  label: string;
  content: ReactNode;
  icon: ReactNode;
}

export function useTabItems() {
  const { isAdmin } = useAuth();

  return [
    {
      label: isAdmin ? 'Articulos' : 'Catálogo',
      content: <ProductsTab />,
      icon: <StorefrontOutlinedIcon />,
    },
    { label: 'Imágenes', content: <ImagesTab />, icon: <ImageOutlinedIcon /> },
    {
      label: 'Pedidos',
      content: <PreordersTab />,
      icon: <ReceiptLongOutlinedIcon />,
    },
  ];
}

export default function UsersTabs() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const tabs = useTabItems();
  const currentTab = R.nth(tab, tabs) ?? { label: '', content: null };

  return (
    <Box sx={{ width: '100%', paddingBottom: 2 }}>
      {!isMobile && (
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          {R.addIndex<TabItem, JSX.Element>(R.map)(
            (t, i) => (
              <Tab key={i} label={t.label} />
            ),
            tabs,
          )}
        </Tabs>
      )}

      <Box sx={{ mt: isMobile ? 2 : 2, pb: isMobile ? 8 : 0 }}>
        {currentTab.content}
      </Box>

      {isMobile && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            borderTop: '1px solid',
            borderColor: 'divider',
            borderRadius: 0,
          }}
          elevation={0}
        >
          <BottomNavigation
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ backgroundColor: 'background.paper' }}
          >
            {tabs.map((t, i) => (
              <BottomNavigationAction
                key={i}
                label={t.label}
                icon={t.icon}
                sx={{
                  color: 'text.secondary',
                  '&.Mui-selected': { color: 'primary.main' },
                  minWidth: 0,
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
