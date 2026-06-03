'use client';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import {
  TableRow,
  TableCell,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { includes } from 'ramda';

import { PreordersTableContent } from '@/src/components/preorders/PreordersTableContent';
import {
  EMPTY_VALUE,
  orderStatusesDict,
  statusColorsDict,
} from '@/src/constants';
import { useAuth } from '@/src/context/AuthContext';
import { usePreordersContext } from '@/src/context/PreordersContext';
import { deliveryStatusesDict } from '@/src/helpers/helpers';
import { StyledChip, RoundIconButton } from '@/src/styledComponents';
import { OrderType } from '@/src/types/types';

export function PreordersRow({ order }: { order: OrderType }) {
  const { isAdmin } = useAuth();
  const { toggleExpand, expandedOrderId, openDialog, openDeliveryDialog } =
    usePreordersContext();

  const expanded = expandedOrderId === order.id;

  const willNotDeliverStatus = includes(order.delivery_status, [
    'failed',
    'not_applicable',
  ]);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => toggleExpand(order.id)}>
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>{order.id}</TableCell>

        {isAdmin && <TableCell>{order.profile_name || EMPTY_VALUE}</TableCell>}

        <TableCell align="center">
          <StyledChip
            label={orderStatusesDict[order.status]}
            color={statusColorsDict[order.status]}
            variant="outlined"
          />
        </TableCell>
        <TableCell align="center">
          {order.status === 'cancelled' ? (
            <RemoveSharpIcon color="error" sx={{ fontSize: 20 }} />
          ) : (
            deliveryStatusesDict[order.delivery_status]
          )}
        </TableCell>

        <TableCell width={100}>€ {Number(order.total).toFixed(2)}</TableCell>

        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>

        <TableCell sx={{ maxWidth: 260 }}>
          {order.comment || order.admin_comment ? (
            <Stack spacing={0.5}>
              {order.comment && (
                <Typography variant="caption">
                  <strong>Cliente:</strong> {order.comment}
                </Typography>
              )}

              {order.admin_comment && (
                <Typography variant="caption">
                  <strong>Admin:</strong> {order.admin_comment}
                </Typography>
              )}
            </Stack>
          ) : (
            '—'
          )}
        </TableCell>

        {isAdmin && (
          <TableCell align="center">
            <RoundIconButton
              disabled={order.status !== 'pending'}
              onClick={() => openDialog(order, 'approved')}
            >
              <CheckIcon />
            </RoundIconButton>
          </TableCell>
        )}

        {isAdmin && (
          <TableCell align="center">
            <RoundIconButton
              disabled={order.status !== 'pending'}
              onClick={() => openDialog(order, 'cancelled')}
            >
              <ClearIcon />
            </RoundIconButton>
          </TableCell>
        )}

        {isAdmin && (
          <TableCell align="center">
            <RoundIconButton
              size="small"
              disabled={
                order.status !== 'approved' ||
                order.delivery_status !== 'waiting'
              }
              onClick={() => openDeliveryDialog(order)}
            >
              {willNotDeliverStatus ? (
                <RemoveSharpIcon />
              ) : (
                <LocalShippingOutlinedIcon />
              )}
            </RoundIconButton>
          </TableCell>
        )}
      </TableRow>

      {expanded && (
        <TableRow>
          <TableCell colSpan={isAdmin ? 11 : 8}>
            <PreordersTableContent order={order} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
