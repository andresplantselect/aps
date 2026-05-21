import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TableViewIcon from '@mui/icons-material/TableView';
import { ToggleButtonGroup } from '@mui/material';

import { TogglePillButton } from '@/src/styledComponents';
import { UseProductsStateProps } from '@/src/types/propsTypes';

export default function ProductsViewToggle({
  viewMode,
  setViewMode,
}: UseProductsStateProps) {
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
