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

async function listAllAuthUsers(env: Record<string, string>) {
  const baseUrl = env.SUPABASE_URL;
  const serviceKey = requireServiceKey(env);
  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  const perPage = 200;
  let page = 1;
  const all: { id: string; email?: string }[] = [];

  while (true) {
    const res = await fetch(
      `${baseUrl}/auth/v1/admin/users?page=${page}&per_page=${perPage}`,
      { headers: authHeaders },
    );
    if (!res.ok) {
      throw new Error(
        `Failed to list auth users (${res.status}): ${await res.text()}`,
      );
    }
    const data = await res.json();
    const users = data.users ?? [];
    all.push(...users);
    if (users.length < perPage) break;
    page++;
  }

  return all;
}

async function deleteTestUsersByDomain(
  domain: string,
  env: Record<string, string>,
) {
  const users = await listAllAuthUsers(env);
  const matching = users.filter((u) =>
    u.email?.toLowerCase().endsWith(`@${domain.toLowerCase()}`),
  );

  const deletedEmails: string[] = [];
  for (const user of matching) {
    await deleteTestUserByEmail(user.email as string, env);
    deletedEmails.push(user.email as string);
  }

  return deletedEmails;
}

async function deleteNumberedTestUsers(env: Record<string, string>) {
  const users = await listAllAuthUsers(env);
  // Only numbered throwaway accounts (user_test1@aps.com, admin_test2@aps.com, ...)
  // — the digit requirement keeps this from ever matching the permanent
  // fixtures user_test@aps.com / admin_test@aps.com.
  const matching = users.filter((u) =>
    /^(user|admin)_test\d+@aps\.com$/i.test(u.email ?? ''),
  );

  const deletedEmails: string[] = [];
  for (const user of matching) {
    await deleteTestUserByEmail(user.email as string, env);
    deletedEmails.push(user.email as string);
  }

  return deletedEmails;
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

async function getOrderByComment(comment: string, env: Record<string, string>) {
  const baseUrl = env.SUPABASE_URL;
  const serviceKey = requireServiceKey(env);
  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  const res = await fetch(
    `${baseUrl}/rest/v1/orders?comment=eq.${encodeURIComponent(comment)}&select=id,total,items,user_id,status,comment&order=created_at.desc&limit=1`,
    { headers: authHeaders },
  );
  if (!res.ok) {
    throw new Error(
      `Failed to look up order by comment (${res.status}): ${await res.text()}`,
    );
  }
  const rows = await res.json();
  return rows?.[0] ?? null;
}

async function createTestOrder(
  {
    userEmail,
    comment,
    items,
  }: {
    userEmail: string;
    comment: string;
    items: { title: string; quantity: number }[];
  },
  env: Record<string, string>,
) {
  const baseUrl = env.SUPABASE_URL;
  const serviceKey = requireServiceKey(env);
  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  };

  const user = await findAuthUserByEmail(userEmail, env);
  if (!user) {
    throw new Error(`Cannot create test order: user ${userEmail} not found.`);
  }

  const orderItems = [];
  for (const { title, quantity } of items) {
    const res = await fetch(
      `${baseUrl}/rest/v1/products?title=eq.${encodeURIComponent(title)}&select=id,price,units_per_box,can_buy_units`,
      { headers: authHeaders },
    );
    if (!res.ok) {
      throw new Error(
        `Failed to look up product ${title} (${res.status}): ${await res.text()}`,
      );
    }
    const rows = await res.json();
    const product = rows?.[0];
    if (!product) {
      throw new Error(`Cannot create test order: product ${title} not found.`);
    }

    orderItems.push({
      product_id: product.id,
      title,
      price: product.price,
      quantity,
      can_buy_units: product.can_buy_units,
      units_per_box: product.units_per_box,
    });
  }

  const total = orderItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  const insertRes = await fetch(`${baseUrl}/rest/v1/orders`, {
    method: 'POST',
    headers: { ...authHeaders, Prefer: 'return=representation' },
    body: JSON.stringify({
      user_id: user.id,
      items: orderItems,
      total: Number(total.toFixed(2)),
      comment,
      status: 'pending',
    }),
  });
  if (!insertRes.ok) {
    throw new Error(
      `Failed to create test order (${insertRes.status}): ${await insertRes.text()}`,
    );
  }
  const [order] = await insertRes.json();
  return order;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// cy.task() is not retried by Cypress the way cy.get()/cy.contains() are,
// so a single fetch here can easily run before the trigger's async
// net.http_post call has actually landed a row. Poll from the Node side
// instead until we have at least `minRows` or time out.
async function getNotificationsForOrder(
  {
    orderId,
    minRows = 1,
    timeoutMs = 15000,
  }: { orderId: number; minRows?: number; timeoutMs?: number },
  env: Record<string, string>,
) {
  const baseUrl = env.SUPABASE_URL;
  const serviceKey = requireServiceKey(env);
  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  const deadline = Date.now() + timeoutMs;
  let rows: unknown[] = [];

  while (Date.now() < deadline) {
    const res = await fetch(
      `${baseUrl}/rest/v1/notifications_log?order_id=eq.${orderId}&select=function_name,payload,created_at`,
      { headers: authHeaders },
    );
    if (!res.ok) {
      throw new Error(
        `Failed to look up notifications_log for order ${orderId} (${res.status}): ${await res.text()}`,
      );
    }
    rows = await res.json();
    if (rows.length >= minRows) return rows;
    await sleep(500);
  }

  return rows;
}

async function deleteTestOrders(
  commentPrefix: string,
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
    `${baseUrl}/rest/v1/orders?comment=like.${encodeURIComponent(commentPrefix)}*&select=id`,
    { headers: authHeaders },
  );
  if (!listRes.ok) {
    throw new Error(
      `Failed to list test orders (${listRes.status}): ${await listRes.text()}`,
    );
  }
  const orders: { id: number }[] = await listRes.json();
  const orderIds = orders.map((o) => o.id);

  if (orderIds.length > 0) {
    const notificationsRes = await fetch(
      `${baseUrl}/rest/v1/notifications_log?order_id=in.(${orderIds.join(',')})`,
      { method: 'DELETE', headers: authHeaders },
    );
    if (!notificationsRes.ok) {
      throw new Error(
        `Failed to delete notifications_log rows (${notificationsRes.status}): ${await notificationsRes.text()}`,
      );
    }
  }

  const deleteRes = await fetch(
    `${baseUrl}/rest/v1/orders?comment=like.${encodeURIComponent(commentPrefix)}*`,
    { method: 'DELETE', headers: authHeaders },
  );
  if (!deleteRes.ok) {
    throw new Error(
      `Failed to delete test orders (${deleteRes.status}): ${await deleteRes.text()}`,
    );
  }

  return orderIds;
}

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    // CI runners are noticeably slower than local dev machines; the
    // default (4000ms) is too tight there and produces flaky failures.
    defaultCommandTimeout: 15000,
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
        async getOrderByComment(comment: string) {
          return getOrderByComment(comment, config.env);
        },
        async createTestOrder(args: {
          userEmail: string;
          comment: string;
          items: { title: string; quantity: number }[];
        }) {
          return createTestOrder(args, config.env);
        },
        async getNotificationsForOrder(args: {
          orderId: number;
          minRows?: number;
          timeoutMs?: number;
        }) {
          return getNotificationsForOrder(args, config.env);
        },
        async deleteTestOrders(commentPrefix: string) {
          return deleteTestOrders(commentPrefix, config.env);
        },
        async deleteTestUsersByDomain(domain: string) {
          return deleteTestUsersByDomain(domain, config.env);
        },
        async deleteNumberedTestUsers() {
          return deleteNumberedTestUsers(config.env);
        },
      });

      return config;
    },
  },
});
