'use client';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { includes } from 'ramda';
import { memo } from 'react';

import {
  orderStatusesDict,
  statusColorsDict,
  deliveryStatusesDict,
  deliveryStatusChipColors,
} from '@/src/constants';
import { useAuth } from '@/src/context/AuthContext';
import { usePreordersContext } from '@/src/context/PreordersContext';
import { RoundIconButton, StyledChip } from '@/src/styledComponents';
import { OrderType } from '@/src/types/types';

export const PreordersCard = memo(function PreordersCard({
  order,
}: {
  order: OrderType;
}) {
  const { isAdmin } = useAuth();
  const { openDialog, openDeliveryDialog } = usePreordersContext();

  const willNotDeliverStatus = includes(order.delivery_status, [
    'failed',
    'not_applicable',
  ]);

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px !important',
        '&:before': { display: 'none' },
        overflow: 'hidden',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ px: 2, py: 0.5, minHeight: 56 }}
      >
        <Stack spacing={0.5} sx={{ width: '100%', pr: 1 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <StyledChip
              label={orderStatusesDict[order.status]}
              color={statusColorsDict[order.status]}
              variant="filled"
              size="small"
            />
            <StyledChip
              label={
                deliveryStatusesDict[order.delivery_status] ??
                order.delivery_status
              }
              color={
                deliveryStatusChipColors[order.delivery_status] ?? 'default'
              }
              variant="outlined"
              size="small"
            />
            <Typography variant="body2" fontWeight={600}>
              € {Number(order.total).toFixed(2)}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {new Date(order.created_at).toLocaleDateString()}
            </Typography>
            {isAdmin && order.profile_name && (
              <Typography variant="caption" color="text.secondary">
                · {order.profile_name}
              </Typography>
            )}
          </Stack>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        <Divider />
        <Stack spacing={0} divider={<Divider />}>
          {order.items.map((item) => {
            const total = Number(item.price) * Number(item.quantity);
            return (
              <Stack
                key={item.product_id ?? item.title}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                px={2}
                py={1}
              >
                <Stack>
                  <Typography variant="body2">{item.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.quantity} uds · € {Number(item.price).toFixed(2)} / ud
                  </Typography>
                </Stack>
                <Typography variant="body2" fontWeight={600}>
                  € {total.toFixed(2)}
                </Typography>
              </Stack>
            );
          })}

          {(order.comment || order.admin_comment) && (
            <Stack px={2} py={1.5} spacing={0.5}>
              {order.comment && (
                <Typography variant="caption" color="text.secondary">
                  <strong>Cliente:</strong> {order.comment}
                </Typography>
              )}
              {order.admin_comment && (
                <Typography variant="caption" color="text.secondary">
                  <strong>Admin:</strong> {order.admin_comment}
                </Typography>
              )}
            </Stack>
          )}

          {isAdmin && (
            <Stack
              direction="row"
              spacing={1}
              px={2}
              py={1.5}
              justifyContent="flex-end"
            >
              <RoundIconButton
                disabled={order.status !== 'pending'}
                onClick={(e) => {
                  e.stopPropagation();
                  openDialog(order, 'approved');
                }}
                sx={(theme) => ({
                  backgroundColor:
                    order.status !== 'pending'
                      ? undefined
                      : theme.palette.success.main,
                })}
              >
                <CheckIcon />
              </RoundIconButton>

              <RoundIconButton
                disabled={order.status !== 'pending'}
                onClick={(e) => {
                  e.stopPropagation();
                  openDialog(order, 'cancelled');
                }}
                sx={(theme) => ({
                  backgroundColor:
                    order.status !== 'pending'
                      ? undefined
                      : theme.palette.error.main,
                })}
              >
                <ClearIcon />
              </RoundIconButton>

              <RoundIconButton
                disabled={
                  order.status !== 'approved' ||
                  order.delivery_status !== 'waiting'
                }
                onClick={(e) => {
                  e.stopPropagation();
                  openDeliveryDialog(order);
                }}
              >
                {willNotDeliverStatus ? (
                  <RemoveSharpIcon />
                ) : (
                  <LocalShippingOutlinedIcon />
                )}
              </RoundIconButton>
            </Stack>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
});
