'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { supabase } from '@/lib/supabase';
import PanelCardFormLayout from '@/src/components/auth/PanelCardFormLayout';
import CommonForm from '@/src/components/form/CommonForm';
import { SignUpFormConfig } from '@/src/components/form/formConfigs';
import { useConsumeInvite, useInviteToken, useSignUp } from '@/src/hooks/api';
import { AlertType, FormField, SignUpFormType } from '@/src/types/types';

export default function SignUpForm() {
  const [signUpForm, setSignUpForm] = useState<SignUpFormType>({
    email: '',
    password: '',
    name: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [alert, setAlert] = useState<AlertType>(null);
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { checkInviteToken } = useInviteToken();
  const { signUp } = useSignUp();
  const { consumeInvite } = useConsumeInvite();

  useEffect(() => {
    const verifyToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('invite');

      if (!token) {
        setAlert({
          message: 'Token de invitación no proporcionado',
          severity: 'error',
        });
        return;
      }

      const { data, error } = await checkInviteToken(token);

      if (error) {
        setAlert(error);
        return;
      }

      const parsed = data ? JSON.parse(data) : null;
      const id = parsed?.inviteId ?? null;

      if (!id) {
        setAlert({
          message: 'Token inválido o ya usado',
          severity: 'error',
        });
        return;
      }

      setInviteId(id);
    };

    void verifyToken();
  }, []);

  const handleSubmit = async () => {
    if (!inviteId || !isFormValid) return;

    setIsLoading(true);

    const { email, password, name } = signUpForm;

    const { data: signUpData, error: signUpError } = await signUp({
      email,
      password,
      name,
    });

    if (signUpError) {
      setAlert(signUpError);
      setIsLoading(false);
      return;
    }

    if (!signUpData?.user) {
      setIsLoading(false);
      return;
    }

    const userId = signUpData.user.id;

    const { error: consumeError, success } = await consumeInvite({
      inviteId,
      userId,
    });

    if (consumeError) {
      setAlert(consumeError);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setAlert(success);
    await supabase.auth.refreshSession();
    router.push('/');
  };

  return (
    <PanelCardFormLayout
      submit={{
        title: 'Registrarse',
        handler: handleSubmit,
      }}
      loading={isLoading}
      alert={alert}
      setAlert={(v) => setAlert(v)}
    >
      <CommonForm<SignUpFormType>
        fillForm={(form, isValid) => {
          setSignUpForm(form as SignUpFormType);
          setIsFormValid(isValid);
        }}
        formConfig={SignUpFormConfig as FormField<SignUpFormType>[]}
      />
    </PanelCardFormLayout>
  );
}
