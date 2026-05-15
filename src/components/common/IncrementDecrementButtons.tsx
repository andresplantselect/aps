import { Add, Remove } from "@mui/icons-material";
import { Stack, IconButton, Typography } from "@mui/material";
import { equals } from "ramda";
import React from "react";

interface PreorderButtonProps {
  quantity: number;
  onChange: (q: number) => void;
  disableAdd: boolean;
}

export default function IncrementDecrementButtons({
  quantity,
  onChange,
  disableAdd,
}: PreorderButtonProps) {
  const increment = () => {
    if (disableAdd) return;
    return onChange(quantity + 1);
  };

  const decrement = () => {
    if (quantity < 0) return;
    return onChange(quantity - 1);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: 70 }}
    >
      <IconButton
        disabled={equals(quantity, 0)}
        onClick={decrement}
        size="small"
        sx={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: "1px solid #ccc",
        }}
      >
        <Remove sx={{ width: 15, height: 15 }} />
      </IconButton>

      <Typography>{quantity}</Typography>

      <IconButton
        disabled={disableAdd}
        onClick={increment}
        size="small"
        sx={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: "1px solid #ccc",
        }}
      >
        <Add sx={{ width: 15, height: 15 }} />
      </IconButton>
    </Stack>
  );
}
