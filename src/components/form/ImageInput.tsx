import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ElementType } from 'react';

import { PrimaryButton, VisuallyHiddenInput } from '@/src/styledComponents';

// styled(Button) drops MUI's polymorphic `component` prop typing, so cast
// it back to ElementType for this one usage rather than loosening the
// shared PrimaryButton type for every other call site.
const LabelButton = PrimaryButton as ElementType;

export default function ImageInput({
  onChange,
}: {
  onChange: (fileList: FileList | null) => void;
}) {
  return (
    <LabelButton component="label" endIcon={<CloudUploadIcon />}>
      Añadir imágenes
      <VisuallyHiddenInput
        type="file"
        multiple
        onChange={(e) => onChange(e.target.files)}
      />
    </LabelButton>
  );
}
