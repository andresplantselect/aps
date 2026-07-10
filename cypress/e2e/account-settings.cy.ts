import { SELECTORS } from '../support/selectors';

describe('Account settings: change password and name from "Editar perfil"', () => {
  const fixtureEmail = Cypress.env('TEST_USER_EMAIL') as string;
  const fixturePassword = Cypress.env('TEST_USER_PASSWORD') as string;
  const newPassword = 'CypressNewPass456';
  const newName = 'Cypress Account Renamed';

  const originalName = 'User Test';

  after(() => {
    cy.task('restoreTestUser', {
      email: fixtureEmail,
      password: fixturePassword,
      name: originalName,
    });
  });

  it('lets a logged-in user update their name and password via the profile menu, and both changes take effect', () => {
    cy.viewport(1280, 800);

    cy.visit('/');
    cy.contains('button', 'Inicia sesión').click();
    cy.getByLabel('Correo electrónico').type(fixtureEmail);
    cy.getByLabel('Contraseña').type(fixturePassword);
    cy.contains('button', 'Iniciar sesión').click();

    cy.contains('Catálogo').should('be.visible');
    cy.wait(2000);

    cy.get(SELECTORS.menuIcon).should('be.visible').click();
    cy.contains('Editar perfil').click();

    cy.get(SELECTORS.dialog).should('be.visible').as('profileDialog');

    cy.get('@profileDialog').find(SELECTORS.editIcon).first().click();
    cy.getByLabel('Nombre').should('not.be.disabled').clear().type(newName);
    cy.get('@profileDialog').find(SELECTORS.checkIcon).click();
    cy.contains('Nombre actualizado.').should('be.visible');
    cy.contains(`Hola, ${newName}!`).should('be.visible');

    cy.get('@profileDialog').find(SELECTORS.editIcon).last().click();
    cy.getByLabel('Contraseña').should('not.be.disabled').type(newPassword);
    cy.getByLabel('Confirmar Contraseña').type(newPassword);
    cy.get('@profileDialog').find(SELECTORS.checkIcon).click();
    cy.contains('Contraseña actualizada.').should('be.visible');
  });

  it('confirms the changes were actually persisted', () => {
    cy.task('getUserName', fixtureEmail).should('eq', newName);

    cy.attemptLogin(fixtureEmail, newPassword).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.access_token).to.be.a('string');
    });

    cy.attemptLogin(fixtureEmail, fixturePassword).then((response) => {
      expect(response.status).to.not.eq(200);
    });
  });
});
