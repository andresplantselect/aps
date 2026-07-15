describe('Cleanup: remove all Cypress-generated test data', () => {
  it('deletes test orders, products, and throwaway users', () => {
    cy.task('deleteTestOrders', 'Cypress Order Test');
    cy.task('deleteTestProducts', 'Cypress ');
    cy.task('deleteTestUsersByDomain', 'aps-test.com');
  });
});
