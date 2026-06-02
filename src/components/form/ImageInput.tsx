import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { PrimaryButton, VisuallyHiddenInput } from '@/src/styledComponents';

export default function ImageInput({
  onChange,
}: {
  onChange: (fileList: FileList | null) => void;
}) {
  return (
    <label style={{ display: 'contents' }}>
      <PrimaryButton endIcon={<CloudUploadIcon />} tabIndex={-1}>
        Añadir imágenes
      </PrimaryButton>
      <VisuallyHiddenInput
        type="file"
        multiple
        onChange={(e) => onChange(e.target.files)}
      />
    </label>
  );
}
