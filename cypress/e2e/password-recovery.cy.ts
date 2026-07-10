import { faker } from '@faker-js/faker';

describe('Password recovery flow', () => {
  const testEmail = `cypress-recovery-${faker.string.alphanumeric(8)}@aps-test.com`;
  const initialPassword = 'CypressOldPass123';
  const newPassword = 'CypressNewPass456';
  const testName = `Cypress Recovery Test (${faker.person.firstName()})`;

  before(() => {
    cy.task('createTestUser', {
      email: testEmail,
      password: initialPassword,
      name: testName,
    });
  });

  after(() => {
    cy.task('deleteTestUser', testEmail);
  });

  it('sends a recovery code and lets the user set a new password with it', () => {
    cy.visit('/');
    cy.contains('button', 'Inicia sesión').click();
    cy.contains('button', 'Recuperar').click();

    cy.getByLabel('Correo electrónico').type(testEmail);

    // Stubbed: never hits Supabase's real mailer, so this never counts
    // against the project's email send rate limit and never attempts a
    // real email. The recovery code itself is fetched below via the admin
    // generate_link API, which doesn't send anything either.
    cy.intercept('POST', '**/auth/v1/otp*', {
      statusCode: 200,
      body: {},
    }).as('sendOtp');
    cy.contains('button', 'Enviar código').click();
    cy.wait('@sendOtp');
    cy.contains('Revisa tu correo').should('be.visible');

    cy.task('getRecoveryOtp', testEmail).then((otp) => {
      cy.visit(`/reset-password?email=${encodeURIComponent(testEmail)}`);

      cy.getByLabel('Código de verificación').type(otp as string);
      cy.contains('button', 'Verificar').click();

      cy.getByLabel('Contraseña').type(newPassword);
      cy.getByLabel('Confirmar Contraseña').type(newPassword);
      cy.contains('button', 'Guardar contraseña').click();

      cy.contains('Contraseña actualizada').should('be.visible');
      cy.location('pathname', { timeout: 10000 }).should('eq', '/');
      cy.contains('Catálogo').should('be.visible');
    });

    cy.attemptLogin(testEmail, newPassword).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.access_token).to.be.a('string');
    });

    cy.attemptLogin(testEmail, initialPassword).then((response) => {
      expect(response.status).to.not.eq(200);
    });
  });
});
