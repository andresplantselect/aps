import { Typography, Box, Stack } from '@mui/material';
import React from 'react';

import RedirectionLink from '@/src/components/common/RedirectionLink';
import { PrimaryButton, WelcomeBox } from '@/src/styledComponents';

export default function WelcomeSection({
  onLogin,
  onHelp,
}: {
  onLogin: () => void;
  onHelp: () => void;
}) {
  return (
    <WelcomeBox sx={{ mt: 2, height: '100%' }}>
      <Box
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(
              to bottom,
              rgba(255,255,255,0.95) 0%,
              rgba(255,255,255,0.85) 75%,
              rgba(255,255,255,0.6) 85%,
              rgba(255,255,255,0.2) 90%,
              rgba(255,255,255,0) 100%
            )
          `,
        }}
      />
      <Box
        component="img"
        src="/orchid.png"
        alt="orchid"
        sx={{
          position: 'absolute',
          right: '-30%',
          bottom: '-5%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.3,
        }}
      />

      <Stack spacing={2} sx={{ marginTop: 0, zIndex: 2, padding: 3 }}>
        <Typography variant="h5">Bienvenido a Andrés Plant Select!</Typography>

        <Typography color="text.secondary">
          Aquí puedes explorar la lista de artículos disponibles, que se
          actualiza con cada nueva llegada.
        </Typography>

        <RedirectionLink
          linkText="Primera vez aquí?"
          linkTitle="Aprende cómo funciona la aplicación →"
          onLinkClick={onHelp}
        />

        <Box pt={4} sx={{ alignSelf: 'center' }}>
          <PrimaryButton onClick={onLogin}>Inicia sesión</PrimaryButton>
        </Box>
      </Stack>
    </WelcomeBox>
  );
}
