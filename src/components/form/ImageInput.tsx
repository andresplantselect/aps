import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef } from 'react';

import { PrimaryButton, VisuallyHiddenInput } from '@/src/styledComponents';

export default function ImageInput({
  onChange,
}: {
  onChange: (fileList: FileList | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <PrimaryButton
        endIcon={<CloudUploadIcon />}
        onClick={() => inputRef.current?.click()}
      >
        Añadir imágenes
      </PrimaryButton>
      <VisuallyHiddenInput
        ref={inputRef}
        type="file"
        multiple
        onChange={(e) => onChange(e.target.files)}
      />
    </>
  );
}
