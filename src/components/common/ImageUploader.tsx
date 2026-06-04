'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Stack, Typography, IconButton } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import ImageInput from '@/src/components/form/ImageInput';
import { useUploadImages } from '@/src/hooks/api';

interface ImageUploaderProps {
  initialImages?: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({
  onChange,
  initialImages = [],
}: ImageUploaderProps) {
  const { uploadImages } = useUploadImages();

  const [images, setImages] = useState<string[]>(initialImages);

  const files = useMemo(
    () =>
      images.map((url, i) => ({
        url,
        name: url.split('/').pop() || `file-${i + 1}`,
      })),
    [images],
  );

  useEffect(() => {
    onChange(images);
  }, [images]);

  const handleFilesChange = async (fileList: FileList | null) => {
    if (!fileList) return;

    const { data, error } = await uploadImages(fileList, 'products');

    if (!error && data) {
      setImages((prev) => [...prev, ...data]);
    }
  };

  const handleRemove = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  return (
    <Stack>
      <ImageInput onChange={handleFilesChange} />

      {files.length > 0 && (
        <Stack spacing={0.5} mt={1}>
          {files.map((file, i) => (
            <Stack
              key={i}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="body2"
                sx={{
                  maxWidth: '80%',
                  wordBreak: 'break-all',
                }}
              >
                {file.name}
              </Typography>

              <IconButton size="small" onClick={() => handleRemove(file.url)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
