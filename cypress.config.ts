import { defineConfig } from 'cypress';

function requireServiceKey(env: Record<string, string>) {
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing from cypress.env.json.',
    );
  }
  return serviceKey;
}

async function findAuthUserByEmail(email: string, env: Record<string, string>) {
  const baseUrl = env.SUPABASE_URL;
  const serviceKey = requireServiceKey(env);

  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  const listRes = await fetch(
    `${baseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
    { headers: authHeaders },
  );
  const listData = await listRes.json();
  return listData.users?.[0] ?? null;
}

async function deleteTestUserByEmail(
  email: string,
  env: Record<string, string>,
) {
  const baseUrl = env.SUPABASE_URL;
  const serviceKey = requireServiceKey(env);
  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  const user = await findAuthUserByEmail(email, env);
  if (!user) return null;

  // invites.used_by references this user — delete it first or the
  // auth-user delete below fails on a foreign-key violation.
  const invitesRes = await fetch(
    `${baseUrl}/rest/v1/invites?used_by=eq.${user.id}`,
    { method: 'DELETE', headers: authHeaders },
  );
  if (!invitesRes.ok) {
    throw new Error(
      `Failed to delete invites row(s) for ${email} (${invitesRes.status}): ${await invitesRes.text()}`,
    );
  }

  const profileRes = await fetch(
    `${baseUrl}/rest/v1/profiles?id=eq.${user.id}`,
    { method: 'DELETE', headers: authHeaders },
  );
  if (!profileRes.ok) {
    throw new Error(
      `Failed to delete profile row for ${email} (${profileRes.status}): ${await profileRes.text()}`,
    );
  }

  const authRes = await fetch(`${baseUrl}/auth/v1/admin/users/${user.id}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  if (!authRes.ok) {
    throw new Error(
      `Failed to delete auth user ${email} (${authRes.status}): ${await authRes.text()}`,
    );
  }

  return user.id;
}

async function getUserRole(email: string, env: Record<string, string>) {
  const baseUrl = env.SUPABASE_URL;
  const serviceKey = requireServiceKey(env);
  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  const user = await findAuthUserByEmail(email, env);
  if (!user) return null;

  const res = await fetch(
    `${baseUrl}/rest/v1/profiles?id=eq.${user.id}&select=role`,
    { headers: authHeaders },
  );
  const rows = await res.json();
  return rows?.[0]?.role ?? null;
}

async function getUserName(email: string, env: Record<string, string>) {
  const baseUrl = env.SUPABASE_URL;
  const serviceKey = requireServiceKey(env);
  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  const user = await findAuthUserByEmail(email, env);
  if (!user) return null;

  const res = await fetch(
    `${baseUrl}/rest/v1/profiles?id=eq.${user.id}&select=name`,
    { headers: authHeaders },
  );
  const rows = await res.json();
  return rows?.[0]?.name ?? null;
}

async function createTestUser(
  { email, password, name }: { email: string; password: string; name: string },
  env: Record<string, string>,
) {
  const baseUrl = env.SUPABASE_URL;
  const serviceKey = requireServiceKey(env);
  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  };

  const createRes = await fetch(`${baseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  const user = await createRes.json();

  if (!createRes.ok || !user.id) {
    throw new Error(
      `Failed to create test user ${email} (${createRes.status}): ${JSON.stringify(user)}`,
    );
  }

  // A trigger may have already inserted a bare profile row, so upsert.
  await fetch(`${baseUrl}/rest/v1/profiles?on_conflict=id`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({ id: user.id, role: 'user', name }),
  });

  return user.id as string;
}

async function restoreTestUser(
  { email, password, name }: { email: string; password: string; name: string },
  env: Record<string, string>,
) {
  const baseUrl = env.SUPABASE_URL;
  const serviceKey = requireServiceKey(env);
  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  };

  const user = await findAuthUserByEmail(email, env);
  if (!user) {
    throw new Error(`Cannot restore fixture user ${email}: not found.`);
  }

  const passwordRes = await fetch(`${baseUrl}/auth/v1/admin/users/${user.id}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ password }),
  });
  if (!passwordRes.ok) {
    throw new Error(
      `Failed to restore password for ${email} (${passwordRes.status}): ${await passwordRes.text()}`,
    );
  }

  const profileRes = await fetch(
    `${baseUrl}/rest/v1/profiles?id=eq.${user.id}`,
    {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ name }),
    },
  );
  if (!profileRes.ok) {
    throw new Error(
      `Failed to restore name for ${email} (${profileRes.status}): ${await profileRes.text()}`,
    );
  }

  return user.id;
}

async function getRecoveryOtp(email: string, env: Record<string, string>) {
  const baseUrl = env.SUPABASE_URL;
  const serviceKey = requireServiceKey(env);
  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  };

  // Returns the same recovery code Supabase would have emailed, without
  // needing to read a real inbox.
  const res = await fetch(`${baseUrl}/auth/v1/admin/generate_link`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ type: 'recovery', email }),
  });
  const data = await res.json();

  if (!data.email_otp) {
    throw new Error(
      `generate_link did not return an email_otp: ${JSON.stringify(data)}`,
    );
  }

  return data.email_otp as string;
}

async function deleteTestProducts(
  titlePrefix: string,
  env: Record<string, string>,
) {
  const baseUrl = env.SUPABASE_URL;
  const serviceKey = requireServiceKey(env);
  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  };

  const listRes = await fetch(
    `${baseUrl}/rest/v1/products?title=like.${encodeURIComponent(titlePrefix)}*&select=id,images`,
    { headers: authHeaders },
  );
  if (!listRes.ok) {
    throw new Error(
      `Failed to list test products (${listRes.status}): ${await listRes.text()}`,
    );
  }
  const products: { id: number; images: string[] }[] = await listRes.json();

  const storagePaths = products
    .flatMap((p) => p.images ?? [])
    .map((url) => url.split('/product-images/')[1])
    .filter(Boolean);

  if (storagePaths.length > 0) {
    const storageRes = await fetch(
      `${baseUrl}/storage/v1/object/product-images`,
      {
        method: 'DELETE',
        headers: authHeaders,
        body: JSON.stringify({ prefixes: storagePaths }),
      },
    );
    if (!storageRes.ok) {
      throw new Error(
        `Failed to delete product images (${storageRes.status}): ${await storageRes.text()}`,
      );
    }
  }

  const deleteRes = await fetch(
    `${baseUrl}/rest/v1/products?title=like.${encodeURIComponent(titlePrefix)}*`,
    { method: 'DELETE', headers: authHeaders },
  );
  if (!deleteRes.ok) {
    throw new Error(
      `Failed to delete test products (${deleteRes.status}): ${await deleteRes.text()}`,
    );
  }

  return products.map((p) => p.id);
}

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      on('task', {
        async deleteTestUser(email: string) {
          return deleteTestUserByEmail(email, config.env);
        },
        async getUserRole(email: string) {
          return getUserRole(email, config.env);
        },
        async getUserName(email: string) {
          return getUserName(email, config.env);
        },
        async createTestUser(user: {
          email: string;
          password: string;
          name: string;
        }) {
          return createTestUser(user, config.env);
        },
        async getRecoveryOtp(email: string) {
          return getRecoveryOtp(email, config.env);
        },
        async restoreTestUser(user: {
          email: string;
          password: string;
          name: string;
        }) {
          return restoreTestUser(user, config.env);
        },
        async deleteTestProducts(titlePrefix: string) {
          return deleteTestProducts(titlePrefix, config.env);
        },
      });

      return config;
    },
  },
});
