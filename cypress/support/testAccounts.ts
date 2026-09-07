// Naming convention for e2e test accounts (Supabase project "APS Test").
//
// Two permanent fixtures (no number), credentials only in cypress.env.json,
// never committed:
//   - TEST_USER_EMAIL / TEST_USER_PASSWORD   -> user_test@aps.com
//   - TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD -> admin_test@aps.com
//
// Throwaway numbered accounts created by individual specs follow the
// formula below and are removed by z-cleanup.cy.ts at the end of every
// run. Numbers are allocated by hand per spec to avoid collisions within
// the same run:
//   1 -> invite.cy.ts (user_test1@aps.com, admin_test1@aps.com)
//   2 -> password-recovery.cy.ts (user_test2@aps.com)
// Pick the next free number when a new spec needs its own throwaway user.

export type TestAccountRole = 'user' | 'admin';

export function numberedTestAccount(role: TestAccountRole, n: number) {
  return {
    email: `${role}_test${n}@aps.com`,
    password: `${role}_TEST${n}`,
  };
}
