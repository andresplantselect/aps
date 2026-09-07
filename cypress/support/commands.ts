export type TestRole = 'admin' | 'user';

const projectRef = (() => {
  const url = Cypress.env('SUPABASE_URL') as string;
  return new URL(url).hostname.split('.')[0];
})();

const storageKey = `sb-${projectRef}-auth-token`;

const credentialsByRole: Record<TestRole, { email: string; password: string }> =
  {
    admin: {
      email: Cypress.env('TEST_ADMIN_EMAIL'),
      password: Cypress.env('TEST_ADMIN_PASSWORD'),
    },
    user: {
      email: Cypress.env('TEST_USER_EMAIL'),
      password: Cypress.env('TEST_USER_PASSWORD'),
    },
  };

function passwordGrantRequest(email: string, password: string) {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('SUPABASE_URL')}/auth/v1/token?grant_type=password`,
    headers: {
      apikey: Cypress.env('SUPABASE_ANON_KEY'),
      'Content-Type': 'application/json',
    },
    body: { email, password },
    failOnStatusCode: false,
  });
}

Cypress.Commands.add('attemptLogin', (email: string, password: string) =>
  passwordGrantRequest(email, password),
);

// Logs in via the Supabase REST API and writes the session to the
// localStorage key supabase-js reads on init — no UI involved.
function setSessionFromCredentials(email: string, password: string) {
  passwordGrantRequest(email, password).then(({ body: session }) => {
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem(storageKey, JSON.stringify(session));
    });
  });
}

function sessionValidate() {
  cy.window().then((win) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(win.localStorage.getItem(storageKey)).to.exist;
  });
}

Cypress.Commands.add('loginAs', (role: TestRole) => {
  const { email, password } = credentialsByRole[role];

  cy.session([role], () => setSessionFromCredentials(email, password), {
    validate: sessionValidate,
  });

  cy.visit('/');
});

Cypress.Commands.add(
  'loginWithCredentials',
  (email: string, password: string) => {
    cy.session(
      ['creds', email],
      () => setSessionFromCredentials(email, password),
      { validate: sessionValidate },
    );

    cy.visit('/');
  },
);

// MUI TextFields here have a `label` but no `name`/`id`, so we resolve the
// input via the label's `for` attribute instead (React's useId() ids
// contain colons, which aren't valid in a plain `#id` selector).
Cypress.Commands.add('getByLabel', (labelText: string) =>
  cy
    .contains('label', labelText)
    .invoke('attr', 'for')
    .then((id) => cy.get(`[id="${id}"]`)),
);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      loginAs(role: TestRole): Chainable<void>;
      loginWithCredentials(email: string, password: string): Chainable<void>;
      getByLabel(labelText: string): Chainable<JQuery<HTMLElement>>;
      attemptLogin(
        email: string,
        password: string,
      ): Chainable<Cypress.Response<{ access_token?: string }>>;
    }
  }
}

export {};
