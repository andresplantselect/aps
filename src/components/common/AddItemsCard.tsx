import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import { Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import IncrementDecrementButtons from '@/src/components/common/IncrementDecrementButtons';
import { useCart } from '@/src/context/CartContext';
import { splitUnitsToBoxes } from '@/src/helpers/helpers';
import {
  CartCard,
  CustomAccordionText,
  SecondaryRoundIconButton,
} from '@/src/styledComponents';
import { CartItem, ProductType } from '@/src/types/types';

type AddItemsCardProps = {
  title?: string;
  labelAdd?: string;
  labelTotal?: string;
  showClearCart?: boolean;
  productItem: ProductType | CartItem;
};

export default function AddItemsCard({
  title,
  labelAdd,
  labelTotal,
  productItem,
  showClearCart = false,
}: AddItemsCardProps) {
  const { items, updateItemQuantity } = useCart();

  const cartItem = items.find((i) => i.id === productItem.id);
  const quantity = cartItem?.quantity ?? 0;
  const { boxes, units } = splitUnitsToBoxes(
    quantity,
    productItem.units_per_box,
  );

  const [boxesQuantity, setBoxesQuantity] = useState(boxes);
  const [unitsQuantity, setUnitsQuantity] = useState(units);
  const [showUnitsDetails, setShowUnitsDetails] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  const totalUnits = boxesQuantity * productItem.units_per_box + unitsQuantity;
  const totalPrice = totalUnits * productItem.price;
  const disableUnitsAdd = totalUnits >= productItem.available;

  const disableBoxesAdd =
    totalUnits + productItem.units_per_box >= productItem.available;

  useEffect(() => {
    setBoxesQuantity(boxes);
    setUnitsQuantity(units);
  }, [boxes, units]);

  const handleChange = (
    val: number,
    total: number,
    handler: (value: number) => void,
  ) => {
    handler(val);
    updateItemQuantity(
      {
        id: productItem.id,
        title: productItem.title,
        price: productItem.price,
        available: productItem.available,
        can_buy_units: productItem.can_buy_units,
        units_per_box: productItem.units_per_box,
      },
      total,
    );
  };

  const handleRemoveFromCard = () => {
    setBoxesQuantity(0);
    setUnitsQuantity(0);

    updateItemQuantity(
      {
        id: productItem.id,
        title: productItem.title,
        price: productItem.price,
        available: productItem.available,
        can_buy_units: productItem.can_buy_units,
        units_per_box: productItem.units_per_box,
      },
      0,
    );
  };

  const handleBoxesChange = (value: number) => {
    const total = value * productItem.units_per_box + unitsQuantity;

    handleChange(value, total, setBoxesQuantity);
  };

  const handleUnitsChange = (value: number) => {
    const total = boxesQuantity * productItem.units_per_box + value;

    handleChange(value, total, setUnitsQuantity);
  };

  const ClearCart = (
    <SecondaryRoundIconButton
      disabled={totalUnits === 0}
      onClick={handleRemoveFromCard}
    >
      <RemoveShoppingCartOutlinedIcon fontSize="small" />
    </SecondaryRoundIconButton>
  );

  return (
    <CartCard sx={{ mt: 2 }}>
      {title && (
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
          {ClearCart}
        </Stack>
      )}
      <Stack spacing={3}>
        <Stack sx={{ height: 60 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {labelAdd ?? 'Añadir'}:
          </Typography>{' '}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: 160 }}
          >
            <Typography variant="body2">Cajas:</Typography>
            <IncrementDecrementButtons
              disableAdd={disableBoxesAdd}
              quantity={boxesQuantity}
              onChange={handleBoxesChange}
            />
          </Stack>
          {productItem.can_buy_units && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: 160 }}
            >
              <Typography variant="body2">Unidades:</Typography>
              <IncrementDecrementButtons
                disableAdd={disableUnitsAdd}
                quantity={unitsQuantity}
                onChange={handleUnitsChange}
              />
            </Stack>
          )}
        </Stack>

        <Stack spacing={1}>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {labelTotal ?? 'Total'}:
            </Typography>

            <Stack direction="row" alignItems="center">
              <Typography variant="body2">{totalUnits} Uds</Typography>

              <Typography
                variant="caption"
                sx={{ cursor: 'pointer' }}
                onClick={() => setShowUnitsDetails((p) => !p)}
              >
                {showUnitsDetails ? (
                  <ExpandLessOutlinedIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Typography variant="body2">{totalPrice} €</Typography>

              <Typography
                variant="caption"
                sx={{ cursor: 'pointer' }}
                onClick={() => setShowPriceDetails((p) => !p)}
              >
                {showPriceDetails ? (
                  <ExpandLessOutlinedIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </Typography>
            </Stack>
          </Stack>
          {showUnitsDetails && (
            <CustomAccordionText sx={{ mt: 1 }}>
              {productItem.can_buy_units
                ? `${boxesQuantity} Cajas × ${productItem.units_per_box} Uds + ${unitsQuantity} Uds = ${totalUnits} Uds`
                : `${boxesQuantity} Cajas × ${productItem.units_per_box} Uds = ${totalUnits} Uds`}
            </CustomAccordionText>
          )}
          {showPriceDetails && (
            <CustomAccordionText sx={{ mt: 1 }}>
              {totalUnits} Uds × {productItem.price} € ={' '}
              {totalUnits * productItem.price} €
            </CustomAccordionText>
          )}
        </Stack>
      </Stack>
      {showClearCart && (
        <Stack sx={{ position: 'absolute', top: 8, right: 12 }}>
          {ClearCart}
        </Stack>
      )}
    </CartCard>
  );
}
