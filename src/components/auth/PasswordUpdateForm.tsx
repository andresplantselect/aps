import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { Stack } from '@mui/material';
import React, { useRef, useState } from 'react';

import PasswordFields, {
  PasswordFieldsRef,
} from '@/src/components/common/PasswordFields';
import { useAlert } from '@/src/context/AlertContext';
import { validateField, validationRules } from '@/src/helpers/validators';
import { useUpdatePassword } from '@/src/hooks/api';
import { RoundIconButton } from '@/src/styledComponents';

export default function PasswordUpdateForm() {
  const [editingPassword, setEditingPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const passwordRef = useRef<PasswordFieldsRef>(null);
  const { updatePassword } = useUpdatePassword();
  const { showAlert } = useAlert();

  const handleSavePassword = async () => {
    const form = { password, confirm: confirm };

    const errors = [
      ...validateField(password, form, [
        validationRules.required,
        validationRules.password,
      ]),
      ...validateField(confirm, form, [
        validationRules.required,
        validationRules.confirm,
      ]),
    ];

    if (errors.length) {
      showAlert({ message: errors[0], severity: 'error' });
      return;
    }

    const { success, error } = await updatePassword(password);

    if (error) {
      showAlert(error);
      return;
    }

    setEditingPassword(false);
    setPassword('');
    setConfirm('');

    if (success) showAlert(success);
  };

  const handleCancelPassword = () => {
    setEditingPassword(false);
    setPassword('');
    setConfirm('');

    passwordRef.current?.resetVisibility();
  };

  return (
    <Stack
      direction={editingPassword ? 'column' : 'row'}
      spacing={1}
      alignItems={editingPassword ? 'flex-start' : 'center'}
    >
      <PasswordFields
        ref={passwordRef}
        password={{ value: password, onChange: (v) => setPassword(v) }}
        confirm={
          editingPassword
            ? { value: confirm, onChange: (v) => setConfirm(v) }
            : undefined
        }
        disabled={!editingPassword}
      />

      {editingPassword ? (
        <Stack>
          <Stack direction="row" spacing={1}>
            <RoundIconButton onClick={() => handleCancelPassword()}>
              <CloseIcon />
            </RoundIconButton>
            <RoundIconButton
              onClick={() => handleSavePassword()}
              disabled={!password || !confirm}
            >
              <CheckIcon />
            </RoundIconButton>
          </Stack>
        </Stack>
      ) : (
        <RoundIconButton onClick={() => setEditingPassword(true)}>
          <EditIcon />
        </RoundIconButton>
      )}
    </Stack>
  );
}
