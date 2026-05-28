'use client';

import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { Stack, Box, Checkbox } from '@mui/material';
import { isEmpty } from 'ramda';
import React, { useEffect, useState } from 'react';

import EmptyStateMessage from '@/src/components/common/EmptyStateMessage';
import ImageInput from '@/src/components/form/ImageInput';
import { useAuth } from '@/src/context/AuthContext';
import {
  useDeleteImages,
  useGetImages,
  useUploadImages,
} from '@/src/hooks/api';
import { PanelCard, SecondaryButton } from '@/src/styledComponents';

export default function ImagesTab() {
  const { isAdmin } = useAuth();
  const { getImages } = useGetImages();
  const { uploadImages } = useUploadImages();
  const { deleteImages } = useDeleteImages();

  const [images, setImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const fetchImages = async () => {
    const { data } = await getImages();

    if (data) {
      setImages(data);
    }
  };

  useEffect(() => {
    void fetchImages();
  }, []);

  const onCheckboxChange = (url: string, checked: boolean) => {
    if (checked) {
      setSelectedImages((prev) => [...prev, url]);
      return;
    }

    setSelectedImages((prev) => prev.filter((img) => img !== url));
  };

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList) return;

    const { error } = await uploadImages(fileList);

    if (!error) {
      await fetchImages();
    }
  };

  const handleDeleteImages = async (images: string[]) => {
    if (isEmpty(images)) return;

    const { error } = await deleteImages(images);

    if (!error) {
      await fetchImages();
      setSelectedImages([]);
    }
  };

  return (
    <Stack spacing={3}>
      {isAdmin && (
        <Stack gap={1}>
          <ImageInput onChange={handleUpload} />
          <SecondaryButton onClick={() => handleDeleteImages(selectedImages)}>
            Eliminar seleccionadas
          </SecondaryButton>
          <SecondaryButton onClick={() => handleDeleteImages(images)}>
            Eliminar todas
          </SecondaryButton>
        </Stack>
      )}

      {images.length === 0 ? (
        <EmptyStateMessage
          message="No hay imágenes"
          icon={<ImageOutlinedIcon />}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 1400,
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 1.5,
              }}
            >
              {images.map((image, index) => (
                <PanelCard
                  key={index}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    overflow: 'hidden',
                  }}
                >
                  {isAdmin && (
                    <Stack
                      sx={(theme) => ({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        backgroundColor: theme.palette.background.paper,
                      })}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Checkbox
                        checked={selectedImages.includes(image)}
                        onChange={(e) =>
                          onCheckboxChange(image, e.target.checked)
                        }
                        size="small"
                      />
                    </Stack>
                  )}
                  <Box
                    component="img"
                    src={image}
                    alt={`image-${index}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </PanelCard>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Stack>
  );
}
