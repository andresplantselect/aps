'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
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
      <TableCell colSpan={isAdmin ? 9 : 6} sx={{ p: 0, borderBottom: 'none' }}>
        <Box sx={{ px: 3, py: 1 }}>
          <Table
            size="small"
            sx={{
              width: '100%',
              tableLayout: 'fixed',
              '& td, & th': {
                border: 'none',
                padding: '4px 8px',
                fontSize: '0.8rem',
                width: '20%',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Título
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ fontWeight: 600, color: 'text.secondary' }}
                >
                  Precio
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, color: 'text.secondary' }}
                >
                  Cantidad
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, color: 'text.secondary' }}
                >
                  Total uds
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, color: 'text.secondary' }}
                >
                  Total
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
                    sx={{ verticalAlign: 'middle' }}
                  >
                    <TableCell>{item.title}</TableCell>
                    <TableCell align="left">€ {price.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      {boxes} Caj.{!!units && ` + ${units} Uds`}
                    </TableCell>
                    <TableCell align="center">{quantity}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      € {total.toFixed(2)}
                    </TableCell>
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
