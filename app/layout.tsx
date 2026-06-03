import { CssBaseline } from '@mui/material';
import { Manrope } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

import AppProviders from '@/src/components/setup/AppProviders';
import ClientThemeProvider from '@/src/components/setup/ClientThemeProvider';
import ThemeRegistry from '@/src/components/setup/ThemeRegistry';

const manrope = Manrope({
  subsets: ['latin'],
});

export const metadata = {
  title: 'APS',
  description: 'Andres Plant Select — plataforma de preordenes',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <ThemeRegistry>
          <ClientThemeProvider>
            <CssBaseline />

            <AppProviders>{children}</AppProviders>
          </ClientThemeProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
