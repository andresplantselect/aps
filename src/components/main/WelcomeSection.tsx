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
        component="img"
        src="/plants.png"
        alt="plants"
        sx={{
          position: 'absolute',
          right: '-90px',
          bottom: '-120px',
          width: '115%',

          // DESKTOP
          '@media (min-width:900px)': {
            right: '-120px',
            bottom: '-260px',
            width: 520,
          },
          opacity: 0.7,
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
