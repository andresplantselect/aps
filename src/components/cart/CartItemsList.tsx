import AddItemsCard from "@/src/components/common/AddItemsCard";
import { PanelCard } from "@/src/styledComponents";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";

import { CartItemListProps } from "@/src/types/propsTypes";

export function CartItemsList({ items }: CartItemListProps) {
  if (!items.length) {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%" }}
      >
        <Typography color="text.secondary">
          No hay productos en tu preorden.
        </Typography>
      </Stack>
    );
  }

  return (
    <Box sx={{ flex: 1, overflowY: "auto" }}>
      <Stack spacing={1}>
        {items.map((item) => (
          <PanelCard key={item.id}>
            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
              <AddItemsCard productItem={item} />
            </Stack>
          </PanelCard>
        ))}
      </Stack>
    </Box>
  );
}
