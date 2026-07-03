'use client';

import LockOpenIcon from '@mui/icons-material/LockOpen';
import LoginIcon from '@mui/icons-material/Login';
import { Stack } from '@mui/material';
import { equals } from 'ramda';
import React, { useMemo, useState } from 'react';

import { AppDialog } from '@/src/components/common/AppDialog';
import RedirectionLink from '@/src/components/common/RedirectionLink';
import CommonForm from '@/src/components/form/CommonForm';
import {
  AuthFormConfig,
  RequestResetPasswordFormConfig,
} from '@/src/components/form/formConfigs';
import { AuthTitlesDict } from '@/src/constants';
import { useAlert } from '@/src/context/AlertContext';
import { useSendOtp, useSignIn } from '@/src/hooks/api';
import { AuthFormProps, AuthMode } from '@/src/types/propsTypes';
import {
  ForgotPasswordFormType,
  FormField,
  SignInFormType,
} from '@/src/types/types';

export default function AuthView({ open, onClose }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [authForm, setAuthForm] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const isSignIn = equals(mode, 'signIn');
  const isForgotPassword = equals(mode, 'forgotPassword');
  const title = AuthTitlesDict[mode].title || '';

  const { signIn } = useSignIn();
  const { sendOtp } = useSendOtp();
  const { showAlert } = useAlert();

  const signInFormConfig = useMemo(() => AuthFormConfig(authForm), [authForm]);
  const resetFormConfig = useMemo(
    () => RequestResetPasswordFormConfig(authForm.email),
    [authForm],
  );

  const startCooldown = (seconds = 60) => {
    setCooldown(seconds);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!isFormValid || cooldown > 0) return;

    if (isSignIn) {
      const { success, error } = await signIn(authForm as SignInFormType);
      if (error) {
        showAlert(error);
        return;
      }
      if (success) showAlert(success);
      onClose();
      return;
    }

    if (isForgotPassword) {
      const { error } = await sendOtp(authForm.email);
      if (error) {
        showAlert(error);
        return;
      }
      startCooldown();
      showAlert({
        message:
          'Revisa tu correo. Te hemos enviado un código para restablecer tu contraseña.',
        severity: 'success',
      });
      onClose();
    }
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={title}
      icon={isSignIn ? <LoginIcon /> : <LockOpenIcon />}
      primaryButton={{
        disabled: !isFormValid || cooldown > 0,
        handleSubmit,
        title:
          cooldown > 0
            ? `Inténtalo en ${cooldown}s`
            : AuthTitlesDict[mode].submitButton,
      }}
    >
      <Stack sx={{ height: '100%' }} justifyContent="center">
        {isSignIn && (
          <Stack spacing={2}>
            <CommonForm<SignInFormType>
              key={mode}
              fillForm={(form, isValid) => {
                setAuthForm(form);
                setIsFormValid(isValid);
              }}
              formConfig={signInFormConfig as FormField<SignInFormType>[]}
              onSubmit={handleSubmit}
            />
            <RedirectionLink
              linkText="Olvidaste tu contraseña?"
              linkTitle="Recuperar"
              onLinkClick={() => {
                setIsFormValid(false);
                setMode('forgotPassword');
              }}
            />
          </Stack>
        )}

        {isForgotPassword && (
          <Stack spacing={2}>
            <CommonForm<ForgotPasswordFormType>
              key={mode}
              fillForm={(form, isValid) => {
                setAuthForm(form);
                setIsFormValid(isValid);
              }}
              formConfig={
                resetFormConfig as FormField<ForgotPasswordFormType>[]
              }
              onSubmit={handleSubmit}
            />
            <RedirectionLink
              linkText=""
              linkTitle="Volver atrás"
              onLinkClick={() => {
                setAuthForm({});
                setIsFormValid(false);
                setMode('signIn');
              }}
            />
          </Stack>
        )}
      </Stack>
    </AppDialog>
  );
}
