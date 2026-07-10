import { faker } from '@faker-js/faker';

import { SELECTORS } from '../support/selectors';

type InviteRole = 'admin' | 'user';

function assertRoleUi(role: InviteRole) {
  cy.contains('Pedidos').should('be.visible');

  if (role === 'admin') {
    cy.contains('Articulos').should('be.visible');
    cy.contains('button', /^Añadir$/).should('be.visible');
    cy.get(SELECTORS.fab).should('not.exist');
    cy.get('table').should('be.visible');
    cy.contains('Artículo').should('be.visible');
  } else {
    cy.contains('Catálogo').should('be.visible');
    cy.contains('button', /^Añadir$/).should('not.exist');
    cy.get(SELECTORS.fab).should('be.visible');
  }
}

function registerViaInvite(role: InviteRole) {
  const testEmail = `cypress-invite-${role}-${faker.string.alphanumeric(8)}@aps-test.com`;
  const testPassword = 'CypressTest123';
  const testName = `Cypress Invite Test (${faker.person.firstName()})`;

  afterEach(() => {
    cy.task('deleteTestUser', testEmail);
  });

  it(`lets an admin invite a new ${role}, who registers and gets the "${role}" role`, () => {
    let inviteToken: string;

    cy.loginAs('admin');

    cy.get(SELECTORS.menuIcon).click();
    cy.contains('Crear invitación').click();

    if (role === 'admin') {
      cy.get(SELECTORS.switchInput).click({ force: true });
    }

    cy.intercept('POST', '**/functions/v1/create-invite').as('createInvite');
    cy.contains('button', 'Crear').click();

    cy.wait('@createInvite').then(({ response }) => {
      const inviteUrl = response?.body?.inviteUrl as string | undefined;
      expect(inviteUrl, 'invite URL returned by create-invite').to.be.a(
        'string',
      );

      inviteToken = new URL(inviteUrl as string).searchParams.get(
        'invite',
      ) as string;
      expect(inviteToken, 'invite token present in the URL').to.be.a('string');

      cy.visit(`/register?invite=${inviteToken}`);

      cy.getByLabel('Nombre').type(testName);
      cy.getByLabel('Correo electrónico').type(testEmail);
      cy.getByLabel('Contraseña').type(testPassword);
      cy.getByLabel('Confirmar Contraseña').type(testPassword);

      cy.contains('button', 'Registrarse').click();

      cy.location('pathname', { timeout: 10000 }).should('eq', '/');
      assertRoleUi(role);
    });

    cy.attemptLogin(testEmail, testPassword).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.access_token).to.be.a('string');
    });

    cy.task('getUserRole', testEmail).should('eq', role);

    cy.then(() => {
      cy.visit(`/register?invite=${inviteToken}`);
      cy.contains('Token inválido o ya usado').should('be.visible');
    });
  });
}

describe('Invite flow: admin invites a new regular user', () => {
  registerViaInvite('user');
});

describe('Invite flow: admin invites a new admin', () => {
  registerViaInvite('admin');
});
