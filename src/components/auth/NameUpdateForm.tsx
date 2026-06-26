import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { Stack, TextField, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useAlert } from '@/src/context/AlertContext';
import { useAuth } from '@/src/context/AuthContext';
import { useUpdateUserName } from '@/src/hooks/api';
import { RoundIconButton } from '@/src/styledComponents';

export default function NameUpdateForm() {
  const { name: userName, user, refreshProfile } = useAuth();
  const { updateUserName } = useUpdateUserName();
  const { showAlert } = useAlert();

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (userName) setName(userName);
  }, [userName]);

  const handleSaveName = async () => {
    if (!user) return;

    const { success, error } = await updateUserName(name, user.id);

    if (error) showAlert(error);

    await refreshProfile();

    setEditingName(false);
    if (success) showAlert(success);
  };

  return (
    <Stack spacing={1} pt={1}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ width: '100%' }}
      >
        <TextField
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!editingName}
          fullWidth
        />

        {editingName ? (
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => {
                setEditingName(false);
                setName('');
              }}
            >
              <CloseIcon color="error" />
            </IconButton>
            <IconButton
              onClick={() => handleSaveName()}
              disabled={!name.trim()}
            >
              <CheckIcon color="success" />
            </IconButton>
          </Stack>
        ) : (
          <RoundIconButton onClick={() => setEditingName(true)}>
            <EditIcon />
          </RoundIconButton>
        )}
      </Stack>
    </Stack>
  );
}
