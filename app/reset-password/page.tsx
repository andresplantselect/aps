'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';

import { supabase } from '@/lib/supabase';
import PanelCardFormLayout from '@/src/components/auth/PanelCardFormLayout';
import CommonForm from '@/src/components/form/CommonForm';
import {
  OtpFormConfig,
  ResetPasswordFormConfig,
} from '@/src/components/form/formConfigs';
import { useAlert } from '@/src/context/AlertContext';
import { useAuth } from '@/src/context/AuthContext';
import { useUpdatePassword } from '@/src/hooks/api';
import {
  AlertType,
  FormField,
  OtpFormType,
  PasswordFormType,
} from '@/src/types/types';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [step, setStep] = useState<'otp' | 'password'>('otp');
  const [otpForm, setOtpForm] = useState<OtpFormType>({ otp: '' });
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordFormType>({
    password: '',
    confirm: '',
  });
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [alert, setAlert] = useState<AlertType>(null);

  const router = useRouter();
  const { updatePassword } = useUpdatePassword();
  const { showAlert } = useAlert();
  const { refreshAuth } = useAuth();

  const passwordFormConfig = ResetPasswordFormConfig(passwordForm);

  const handleVerifyOtp = async () => {
    if (!isOtpValid) return;

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otpForm.otp,
      type: 'email',
    });

    if (error) {
      setAlert({ message: error.message, severity: 'error' });
      return;
    }

    setStep('password');
  };

  const handleUpdatePassword = async () => {
    if (!isPasswordValid) return;

    const { error } = await updatePassword(passwordForm.password);

    if (error) {
      setAlert(error);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: passwordForm.password,
    });

    if (signInError) {
      setAlert({ message: signInError.message, severity: 'error' });
      return;
    }

    await refreshAuth();

    showAlert({
      message:
        'Contraseña actualizada. Has iniciado sesión con tu nueva contraseña.',
      severity: 'success',
      duration: 6000,
    });

    router.push('/');
  };

  return (
    <PanelCardFormLayout
      alert={alert}
      setAlert={(v) => setAlert(v)}
      submit={{
        title: step === 'otp' ? 'Verificar' : 'Guardar contraseña',
        handler: step === 'otp' ? handleVerifyOtp : handleUpdatePassword,
        disabled: step === 'otp' ? !isOtpValid : !isPasswordValid,
      }}
    >
      {step === 'otp' && (
        <CommonForm<OtpFormType>
          fillForm={(form, isValid) => {
            setOtpForm(form as OtpFormType);
            setIsOtpValid(isValid);
          }}
          formConfig={OtpFormConfig as FormField<OtpFormType>[]}
        />
      )}

      {step === 'password' && (
        <CommonForm<PasswordFormType>
          fillForm={(form, isValid) => {
            setPasswordForm(form as PasswordFormType);
            setIsPasswordValid(isValid);
          }}
          formConfig={passwordFormConfig as FormField<PasswordFormType>[]}
        />
      )}
    </PanelCardFormLayout>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
