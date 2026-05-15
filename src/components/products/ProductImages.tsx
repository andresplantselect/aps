'use client';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { Box, Stack, Modal, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';

interface ProductImagesProps {
  images: string[];
  title: string;
}

export default function ProductImages({ images, title }: ProductImagesProps) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const hasImages = images && images.length > 0;
  const hasMany = images?.length > 1;

  const next = () => {
    if (!hasMany || index === images.length - 1) return;
    setIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (!hasMany || index === 0) return;
    setIndex((prev) => prev - 1);
  };

  const handleClose = () => {
    setOpen(false);
    setIndex(0);
  };

  if (!hasImages) {
    return (
      <Stack
        sx={{
          width: '100%',
          aspectRatio: '1 / 1',
          border: '1px solid',
          borderColor: (theme) => theme.palette.grey[300],
          borderRadius: 1,
          bgcolor: (theme) => theme.palette.grey[100],
          px: 1,
          py: 1,
        }}
        alignItems="center"
        justifyContent="center"
        spacing={0.5}
      >
        <ImageNotSupportedIcon sx={{ fontSize: 28, color: 'grey.500' }} />
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ textAlign: 'center' }}
        >
          No hay imágenes
        </Typography>
      </Stack>
    );
  }

  return (
    <>
      {/* CARD GALLERY */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          cursor: hasMany ? 'pointer' : 'default',
          '&:hover img': {
            transform: hasMany ? 'scale(1.05)' : 'none',
          },
        }}
        onClick={() => setOpen(true)}
      >
        <Image
          src={images[index]}
          alt={title}
          fill
          style={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />

        {hasMany && (
          <Typography
            onClick={() => setOpen(true)}
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              bgcolor: 'rgba(255,255,255,0.7)',
              color: 'black',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            }}
          >
            + {images.length - 1}
          </Typography>
        )}
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(255,255,255,0.9)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleClose}
        >
          <Box
            sx={{
              position: 'relative',
              width: '90%',
              height: '90%',
              transition: 'opacity 0.2s ease',
            }}
          >
            <Image
              src={images[index]}
              alt={`${title}-${index}`}
              fill
              style={{
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
              }}
            />
          </Box>

          {/* Close button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(255,255,255,0.8)',
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Fullscreen arrows */}
          {hasMany && (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                disabled={index === 0}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.6)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                  '&.Mui-disabled': {
                    opacity: 0,
                  },
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                disabled={index === images.length - 1}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.6)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                  '&.Mui-disabled': {
                    opacity: 0,
                  },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
