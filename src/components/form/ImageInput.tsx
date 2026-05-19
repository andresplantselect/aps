import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Stack, Typography } from '@mui/material';

import { SecondaryButton, VisuallyHiddenInput } from '@/src/styledComponents';

export default function ImageInput({
  onChange,
}: {
  onChange: (fileList: FileList | null) => void;
}) {
  return (
    <SecondaryButton
      as="label"
      variant="outlined"
      sx={{ width: 200, justifyContent: 'flex-start', padding: '8px' }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <CloudUploadIcon />
        <Typography sx={{ fontWeight: 600 }}>Añadir imágenes</Typography>
      </Stack>

      <VisuallyHiddenInput
        type="file"
        multiple
        onChange={(e) => onChange(e.target.files)}
      />
    </SecondaryButton>
  );
}
