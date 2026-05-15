"use client";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Typography } from "@mui/material";
import React from "react";

import { FilterPillBox } from "@/src/styledComponents";

interface FilterPillValueProps {
  label: string;
  value: string;
}

export function FilterPillValue({ label, value }: FilterPillValueProps) {
  return (
    <FilterPillBox>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          whiteSpace: "nowrap",
        }}
      >
        {label}:
      </Typography>

      <Typography
        variant="body2"
        sx={{
          ml: 0.5,
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </Typography>
      <KeyboardArrowDownIcon
        fontSize="small"
        sx={{ color: "text.secondary", ml: 1 }}
      />
    </FilterPillBox>
  );
}
