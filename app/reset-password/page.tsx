"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";
import PanelCardFormLayout from "@/src/components/auth/PanelCardFormLayout";
import CommonForm from "@/src/components/form/CommonForm";
import { ResetPasswordFormConfig } from "@/src/components/form/formConfigs";
import { useAlert } from "@/src/context/AlertContext";
import { useUpdatePassword } from "@/src/hooks/api";
import { AlertType, FormField, PasswordFormType } from "@/src/types/types";

export default function Page() {
  const [passwordForm, setPasswordForm] = useState<PasswordFormType>({
    password: "",
    confirm: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [alert, setAlert] = useState<AlertType>(null);

  const router = useRouter();
  const { updatePassword } = useUpdatePassword();
  const { showAlert } = useAlert();

  const resetPasswordFormConfig = ResetPasswordFormConfig(passwordForm);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", "?"));
    const access_token = params.get("access_token");
    const type = params.get("type");

    if (access_token && type === "recovery") {
      supabase.auth.setSession({
        access_token,
        refresh_token: access_token,
      });
    }
  }, []);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const { success, error } = await updatePassword(passwordForm.password);

    if (error) {
      setAlert(error);
      return;
    }

    if (success) showAlert(success);
    router.push("/");
  };

  return (
    <PanelCardFormLayout
      alert={alert}
      setAlert={(v) => setAlert(v)}
      submit={{
        title: "Actualizar",
        handler: handleSubmit,
      }}
    >
      <CommonForm<PasswordFormType>
        fillForm={(form, isValid) => {
          setPasswordForm(form);
          setIsFormValid(isValid);
        }}
        formConfig={resetPasswordFormConfig as FormField<PasswordFormType>[]}
      />
    </PanelCardFormLayout>
  );
}
