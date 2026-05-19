import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import WhereToVoteOutlinedIcon from "@mui/icons-material/WhereToVoteOutlined";
import React from "react";

import { supabase } from "@/lib/supabase";
import { DeliveryStatusType } from "@/src/types/types";

export function getMenuActions({
  isAdmin,
  openUser,
  openInvite,
}: {
  isAdmin: boolean;
  openUser: () => void;
  openInvite: () => void;
}) {
  return [
    {
      value: "invite",
      label: "Crear invitación",
      icon: <PersonAddAlt1Icon fontSize="small" />,
      visibility: isAdmin,
      onClick: openInvite,
    },
    {
      value: "edit",
      label: "Editar perfil",
      icon: <EditIcon fontSize="small" />,
      visibility: true,
      onClick: openUser,
    },
    {
      value: "logout",
      label: "Salir",
      icon: <LogoutIcon fontSize="small" />,
      visibility: true,
      onClick: async () => {
        await supabase.auth.signOut();
      },
    },
  ];
}

export const splitUnitsToBoxes = (totalUnits: number, unitsPerBox: number) => {
  const boxes = Math.floor(totalUnits / unitsPerBox);

  const units = totalUnits % unitsPerBox;

  return {
    boxes,
    units,
  };
};

export const parseNumberInput = (value: unknown): number | null => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).trim().replace(",", ".");

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isNaN(parsed) ? null : parsed;
};

export const deliveryStatusesDict: Record<DeliveryStatusType, React.ReactNode> =
  {
    not_applicable: (
      <RemoveCircleOutlineOutlinedIcon color="error" sx={{ fontSize: 20 }} />
    ),
    failed: (
      <RemoveCircleOutlineOutlinedIcon color="error" sx={{ fontSize: 20 }} />
    ),

    waiting: <ScheduleOutlinedIcon color="warning" sx={{ fontSize: 20 }} />,

    delivered: (
      <WhereToVoteOutlinedIcon color="success" sx={{ fontSize: 20 }} />
    ),
  };
