'use client';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Stack,
  Dialog,
  DialogContent,
  Typography,
  Switch,
  CircularProgress,
  Box,
} from '@mui/material';
import React, { useState } from 'react';

import { supabase } from '@/lib/supabase';
import { useAlert } from '@/src/context/AlertContext';
import {
  PrimaryButton,
  SecondaryButton,
  SecondaryRoundIconButton,
} from '@/src/styledComponents';

type InviteDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function InviteDialog({ open, onClose }: InviteDialogProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { showAlert, clearAlert } = useAlert();

  const handleGenerate = async () => {
    setLoading(true);
    const { data } = await supabase.functions.invoke('create-invite', {
      body: { role: isAdmin ? 'admin' : 'user' },
    });
    setLoading(false);
    if (data?.inviteUrl) setLink(data.inviteUrl);
  };

  const handleCopy = async () => {
    if (!link) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      showAlert({ severity: 'success', message: 'Enlace copiado' });
      setTimeout(() => {
        setCopied(false);
        void clearAlert();
      }, 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleClose = () => {
    setLink(null);
    setIsAdmin(false);
    onClose();
  };

  return (
    <>
      {/* Dialog 1: toggle + create */}
      <Dialog open={open && !link} onClose={handleClose}>
        <Box sx={{ backgroundColor: 'primary.main', px: 3, py: 1.5 }}>
          <Typography
            sx={{
              color: 'primary.contrastText',
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Nueva invitación
          </Typography>
        </Box>
        <DialogContent sx={{ minWidth: 340 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="center">
              <Typography>Es administrador</Typography>
              <Switch
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </Stack>
            <Stack direction="row" justifyContent="center" spacing={1}>
              <SecondaryButton onClick={handleClose}>Cerrar</SecondaryButton>
              <PrimaryButton onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  'Crear'
                )}
              </PrimaryButton>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Dialog 2: generated link */}
      <Dialog open={!!link} onClose={handleClose}>
        <Box sx={{ backgroundColor: 'primary.main', px: 3, py: 1.5 }}>
          <Typography
            sx={{
              color: 'primary.contrastText',
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Enlace generado
          </Typography>
        </Box>
        <DialogContent sx={{ minWidth: 340 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {isAdmin
                  ? 'Enlace de registro de nuevo administrador:'
                  : 'Enlace de registro de nuevo cliente:'}
              </Typography>
              <Stack direction="row" alignItems="flex-start" spacing={1}>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: 'break-all',
                    flex: 1,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  {link}
                </Typography>
                <SecondaryRoundIconButton
                  disabled={copied}
                  onClick={handleCopy}
                >
                  <ContentCopyIcon fontSize="small" />
                </SecondaryRoundIconButton>
              </Stack>
            </Box>
            <Stack direction="row" justifyContent="center">
              <SecondaryButton onClick={handleClose}>Cerrar</SecondaryButton>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
