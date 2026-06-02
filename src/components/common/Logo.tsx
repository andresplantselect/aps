import { Box } from '@mui/material';
import Image from 'next/image';

export default function Logo({ white = false }: { white?: boolean }) {
  return (
    <Box sx={{ width: 168, height: 54, position: 'relative' }}>
      <Image
        src="/logo.svg"
        alt="Logo"
        fill
        style={{
          objectFit: 'contain',
          filter: white ? 'brightness(0) invert(1)' : 'none',
        }}
      />
    </Box>
  );
}
