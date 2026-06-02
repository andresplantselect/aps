'use client';

import React, { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import InviteDialog from '@/src/components/auth/InviteDialog';
import Layout from '@/src/components/common/Layout';
import Loader from '@/src/components/common/Loader';
import HeaderActions from '@/src/components/main/HeaderActions';
import MobileNavDrawer from '@/src/components/main/MobileNavDrawer';
import WelcomeSection from '@/src/components/main/WelcomeSection';
import { useAuth } from '@/src/context/AuthContext';
import { getMenuActions } from '@/src/helpers/helpers';
import AuthView from '@/src/views/AuthView';
import HelpView from '@/src/views/HelpView';
import UpdateUserView from '@/src/views/UpdateUserView';
import UsersTabs from '@/src/views/UsersTabs';
import UserView from '@/src/views/UserView';

export default function Page() {
  const [dialogs, setDialogs] = useState({
    user: false,
    auth: false,
    help: false,
    invite: false,
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const {
    isAuthLoading,
    name,
    isAdmin = false,
    isUser = false,
    isUnknownUser = true,
  } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;

    if (
      hash.includes('error=access_denied') ||
      hash.includes('error_code=otp_expired')
    ) {
      window.history.replaceState(null, '', window.location.pathname);
      document.title = 'APS';
    }
  }, []);

  const openDialog = (key: keyof typeof dialogs) =>
    setDialogs((prev) => ({ ...prev, [key]: true }));

  const closeDialog = (key: keyof typeof dialogs) =>
    setDialogs((prev) => ({ ...prev, [key]: false }));

  if (isAuthLoading) {
    return <Loader />;
  }

  const fetchUrl = async () => {
    const { data } = await supabase.functions.invoke('create-invite');

    if (data) {
      setInviteUrl(data.inviteUrl);
    }
  };

  const actions = getMenuActions({
    isAdmin,
    openUser: () => openDialog('user'),
    openInvite: async () => {
      await fetchUrl();
      openDialog('invite');
    },
  });

  return (
    <Layout
      actions={
        !isUnknownUser && (
          <HeaderActions
            name={name as string}
            actions={actions}
            onMobileMenuOpen={() => setMobileNavOpen(true)}
          />
        )
      }
    >
      {!isUnknownUser && (
        <MobileNavDrawer
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          actions={actions}
          name={name as string}
        />
      )}

      {isAdmin && <UsersTabs />}
      {isUser && <UserView />}

      {isUnknownUser && (
        <WelcomeSection
          onLogin={() => openDialog('auth')}
          onHelp={() => openDialog('help')}
        />
      )}

      {/* dialogs */}
      {dialogs.user && (
        <UpdateUserView open onClose={() => closeDialog('user')} />
      )}

      {dialogs.auth && <AuthView open onClose={() => closeDialog('auth')} />}

      {dialogs.help && <HelpView open onClose={() => closeDialog('help')} />}

      {dialogs.invite && inviteUrl && (
        <InviteDialog
          link={inviteUrl}
          open
          onClose={() => closeDialog('invite')}
        />
      )}
    </Layout>
  );
}
