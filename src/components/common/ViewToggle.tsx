import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TableViewIcon from '@mui/icons-material/TableView';
import { ToggleButtonGroup } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

import { TogglePillButton } from '@/src/styledComponents';
import { ViewModeType } from '@/src/types/types';

export function ViewToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewModeType;
  setViewMode: Dispatch<SetStateAction<ViewModeType>>;
}) {
  return (
    <ToggleButtonGroup
      size="small"
      value={viewMode}
      exclusive
      onChange={(_, v) => v && setViewMode(v)}
    >
      <TogglePillButton value="cards">
        <DragIndicatorIcon fontSize="small" />
      </TogglePillButton>

      <TogglePillButton value="table">
        <TableViewIcon fontSize="small" />
      </TogglePillButton>
    </ToggleButtonGroup>
  );
}
