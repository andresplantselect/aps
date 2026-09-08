import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { useProductInlineEdit } from '@/src/hooks/useProductInlineEdit';

type ProductsInlineEditableCellProps = {
  field: 'available' | 'price';
  value: number;
  isAdmin: boolean;
  edit: ReturnType<typeof useProductInlineEdit>;
  prefix?: string;
  suffix?: string;
};

export function ProductsInlineEditableCell({
  field,
  value,
  isAdmin,
  edit,
  prefix,
  suffix,
}: ProductsInlineEditableCellProps) {
  if (!isAdmin) {
    return (
      <>
        {prefix ? `${prefix} ` : ''}
        {field === 'price' ? Number(value).toFixed(2) : value}
        {suffix ? ` ${suffix}` : ''}
      </>
    );
  }

  const displayValue = field === 'price' ? Number(value).toFixed(2) : value;

  if (edit.editingField === field) {
    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <TextField
          inputRef={edit.inputRef}
          size="small"
          value={edit.editValue}
          onChange={(e) => edit.setEditValue(e.target.value)}
          onKeyDown={edit.handleNumberKeyDown}
          onBlur={edit.saveEdit}
          disabled={edit.saving}
          sx={{ width: 80 }}
          inputProps={{
            style: { padding: '6px 8px', fontSize: '1rem' },
            inputMode: 'decimal',
          }}
          autoFocus
        />
        {suffix && (
          <Typography variant="body2" color="text.secondary">
            {suffix}
          </Typography>
        )}
        <IconButton
          size="small"
          disabled={edit.saving}
          onMouseDown={(e) => {
            e.preventDefault();
            edit.saveEdit();
          }}
        >
          <CheckIcon fontSize="small" color="success" />
        </IconButton>
        <IconButton
          size="small"
          disabled={edit.saving}
          onMouseDown={(e) => {
            e.preventDefault();
            edit.cancelEdit();
          }}
        >
          <CloseIcon fontSize="small" color="error" />
        </IconButton>
      </Stack>
    );
  }

  return (
    <Tooltip title="Click to edit" placement="top">
      <span
        onClick={() => edit.startEdit(field, value)}
        style={{
          cursor: 'pointer',
          borderBottom: '1px dashed currentColor',
          whiteSpace: 'nowrap',
        }}
      >
        {prefix ? `${prefix} ` : ''}
        {displayValue}
        {suffix ? ` ${suffix}` : ''}
      </span>
    </Tooltip>
  );
}
