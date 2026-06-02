'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';

import { useAuth } from '@/src/context/AuthContext';
import { splitUnitsToBoxes } from '@/src/helpers/helpers';
import { OrderType } from '@/src/types/types';

interface PreordersTableContentProps {
  order: OrderType;
}

export function PreordersTableContent({ order }: PreordersTableContentProps) {
  const { isAdmin } = useAuth();

  const items = useMemo(() => order.items ?? [], [order.items]);

  return (
    <TableRow>
      <TableCell colSpan={isAdmin ? 9 : 6} sx={{ p: 0 }}>
        <Box sx={{ px: 2, py: 2, bgcolor: 'grey.50' }}>
          <Table
            size="small"
            sx={{
              width: '100%',
              tableLayout: 'fixed',
              '& tbody tr:last-child td': {
                borderBottom: 'none',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 250 }}>
                  Título
                </TableCell>

                <TableCell align="left" sx={{ width: 90, fontWeight: 600 }}>
                  Precio
                </TableCell>

                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Cantidad
                </TableCell>

                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Total unidades
                </TableCell>

                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Total precio
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((item) => {
                const price = Number(item.price);
                const quantity = Number(item.quantity);
                const total = price * quantity;
                const { boxes, units } = splitUnitsToBoxes(
                  quantity,
                  item.units_per_box,
                );

                return (
                  <TableRow
                    key={item.product_id ?? `${order.id}-${item.title}`}
                    sx={{ verticalAlign: 'top' }}
                  >
                    <TableCell>{item.title}</TableCell>

                    <TableCell align="left">€ {price.toFixed(2)}</TableCell>

                    <TableCell align="center">
                      <>
                        <Typography>{boxes} Cajas</Typography>
                        {!!units && <Typography>+ {units} Uds</Typography>}
                      </>
                    </TableCell>
                    <TableCell align="center">{quantity}</TableCell>

                    <TableCell align="right">€ {total.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </TableCell>
    </TableRow>
  );
}
