'use client';

import { Box, Tabs, Tab } from '@mui/material';
import * as R from 'ramda';
import React, { JSX, useState } from 'react';

import { useAuth } from '@/src/context/AuthContext';
import ImagesTab from '@/src/views/ImagesTab';
import PreordersTab from '@/src/views/PreordersTab';
import ProductsTab from '@/src/views/ProductsTab';

interface TabItem {
  label: string;
  content: React.ReactNode;
}

export default function UsersTabs() {
  const [tab, setTab] = useState(0);
  const { isAdmin } = useAuth();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const tabs = [
    { label: isAdmin ? 'Articulos' : 'Catálogo', content: <ProductsTab /> },
    { label: 'Imágenes', content: <ImagesTab /> },
    { label: 'Pedidos', content: <PreordersTab /> },
  ];

  const currentTab = R.nth(tab, tabs) ?? { label: '', content: null };

  return (
    <Box sx={{ width: '100%', paddingBottom: 2 }}>
      <Tabs value={tab} onChange={handleChange}>
        {R.addIndex<TabItem, JSX.Element>(R.map)(
          (t, i) => (
            <Tab key={i} label={t.label} />
          ),
          tabs,
        )}
      </Tabs>
      <Box sx={{ mt: 2 }}>{currentTab.content}</Box>
    </Box>
  );
}
