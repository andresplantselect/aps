import IncrementDecrementButtons from "@/src/components/common/IncrementDecrementButtons.tsx";
import { useCart } from "@/src/context/CartContext";
import { splitUnitsToBoxes } from "@/src/helpers/helpers";
import { CustomAccordionText } from "@/src/styledComponents";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function AddItemsCard({ labelAdd, labelTotal, productItem }): {
  labelAdd?: string;
  labelTotal?: string;
} {
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

  useEffect(() => {
    setBoxesQuantity(boxes);
    setUnitsQuantity(units);
  }, [boxes, units]);

  const handleBoxesChange = (value: number) => {
    setBoxesQuantity(value);

    const total = value * productItem.units_per_box + unitsQuantity;

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

  const handleUnitsChange = (value: number) => {
    setUnitsQuantity(value);

    const total = boxesQuantity * productItem.units_per_box + value;

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

  return (
    <Stack sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        {labelAdd ?? "Añadir"}:
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: 160 }}
      >
        <Typography variant="body2">Cajas:</Typography>
        <IncrementDecrementButtons
          inStock={productItem.available}
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
            inStock={productItem.available}
            quantity={unitsQuantity}
            onChange={handleUnitsChange}
          />
        </Stack>
      )}
      <Stack direction="row" spacing={0.5} sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {labelTotal ?? "Total"}:
        </Typography>

        <Stack direction="row" alignItems="center">
          <Typography variant="body2">{totalUnits} Uds</Typography>

          <Typography
            variant="caption"
            sx={{ cursor: "pointer" }}
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
            sx={{ cursor: "pointer" }}
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
          {totalUnits} Uds × {productItem.price} € ={" "}
          {totalUnits * productItem.price} €
        </CustomAccordionText>
      )}
    </Stack>
  );
}
