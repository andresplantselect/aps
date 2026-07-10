import { faker } from '@faker-js/faker';

import { SELECTORS } from '../support/selectors';

const titleA = `Cypress ${faker.commerce.productName()} ${faker.string.alphanumeric(6)}`;
const titleAEdited = `${titleA} Edited`;
const titleB = `Cypress ${faker.commerce.productName()} ${faker.string.alphanumeric(6)}`;

function searchFor(term: string) {
  cy.get(SELECTORS.searchInput).clear().type(term);
}

function switchToCardsView() {
  cy.get(SELECTORS.cardsViewIcon).click();
}

function switchToTableView() {
  cy.get(SELECTORS.tableViewIcon).click();
}

function waitForProductCard(title: string) {
  cy.reload();
  switchToCardsView();
  searchFor(title);
  cy.contains(SELECTORS.card, title, { timeout: 10000 }).should('be.visible');
}

function fillCreateProductForm(fields: {
  title: string;
  price: string;
  unitsPerBox: string;
  available: string;
  canBuyUnits?: boolean;
  isVisible?: boolean;
}) {
  cy.get(SELECTORS.dialog).within(() => {
    cy.getByLabel('Título').type(fields.title);
    cy.getByLabel('Precio').type(fields.price);
    cy.getByLabel('Unidades por caja').type(fields.unitsPerBox);
    cy.getByLabel('En stock').type(fields.available);
    if (fields.canBuyUnits) cy.contains('Permitir compra por unidades').click();
    if (fields.isVisible === false) cy.contains('Visible en catálogo').click();
  });
}

function cleanupTestProducts() {
  cy.task('deleteTestProducts', 'Cypress ');
}

describe('Admin product management', () => {
  after(cleanupTestProducts);

  it('lets an admin create products', () => {
    cy.loginAs('admin');
    switchToTableView();

    cy.contains('button', /^Añadir$/).click();
    fillCreateProductForm({
      title: titleA,
      price: '10.00',
      unitsPerBox: '3',
      available: '6',
      canBuyUnits: true,
      isVisible: false,
    });
    cy.contains('button', 'Agregar').click();
    cy.contains(`Artículo ${titleA} agregado.`).should('be.visible');
    waitForProductCard(titleA);

    switchToTableView();
    cy.contains('button', /^Añadir$/).click();
    fillCreateProductForm({
      title: titleB,
      price: '2.00',
      unitsPerBox: '4',
      available: '4',
    });
    cy.contains('button', 'Agregar').click();
    cy.contains(`Artículo ${titleB} agregado.`).should('be.visible');
    waitForProductCard(titleB);
  });

  it('lets an admin edit a product, including its image, and edit price/available/visibility from the table view', () => {
    cy.loginAs('admin');
    switchToTableView();
    searchFor(titleA);
    cy.contains('tr', titleA).find(SELECTORS.editIcon).click();

    cy.get(SELECTORS.dialog).should('be.visible').as('editDialog');
    cy.getByLabel('Título').clear().type(titleAEdited);
    cy.getByLabel('Comentario').type('Planta de interior');
    cy.getByLabel('Diámetro maceta').type('20');
    cy.getByLabel('Altura').type('15');
    cy.get('@editDialog')
      .find('input[type="file"]')
      .selectFile('cypress/fixtures/test-plant.jpg', { force: true });
    cy.contains('test-plant.jpg').should('be.visible');
    cy.contains('button', 'Guardar cambios').click();
    cy.contains(`Artículo ${titleAEdited} actualizado.`).should('be.visible');

    waitForProductCard(titleAEdited);
    cy.contains(SELECTORS.card, titleAEdited).within(() => {
      cy.contains('10.00 €').should('be.visible');
      cy.contains('Maceta: 20 cms').should('be.visible');
      cy.contains('Altura: 15 cms').should('be.visible');
      cy.contains('Uds × Caja: 3').should('be.visible');
      cy.contains('Uds sueltas: Sí').should('be.visible');
      cy.contains('Planta de interior').should('be.visible');
      cy.contains('No hay imágenes').should('not.exist');
    });

    switchToTableView();
    cy.contains('tr', titleAEdited).find('td').eq(2).as('priceCell').click();
    cy.get('@priceCell').find('input').clear().type('12.50');
    cy.get('@priceCell').find(SELECTORS.checkIcon).click();
    cy.contains('tr', titleAEdited).contains('12.50').should('be.visible');

    cy.contains('tr', titleAEdited)
      .find('td')
      .eq(1)
      .as('availableCell')
      .click();
    cy.get('@availableCell').find('input').clear().type('9');
    cy.get('@availableCell').find(SELECTORS.checkIcon).click();
    cy.contains('tr', titleAEdited).contains('9').should('be.visible');

    cy.contains('tr', titleAEdited).find('td').eq(7).find('button').click();

    waitForProductCard(titleAEdited);
    cy.contains(SELECTORS.card, titleAEdited).within(() => {
      cy.contains('12.50 €').should('be.visible');
      cy.contains('Disponible: 9 Uds').should('be.visible');
    });
  });

  it('only shows the loose-units stepper on the catalog for products with can_buy_units enabled', () => {
    cy.loginAs('user');

    searchFor(titleAEdited);
    cy.contains(SELECTORS.card, titleAEdited).within(() => {
      cy.contains('Unidades:').should('be.visible');
    });

    searchFor(titleB);
    cy.contains(SELECTORS.card, titleB).within(() => {
      cy.contains('Unidades:').should('not.exist');
    });
  });

  it('lets an admin delete the test products', () => {
    cy.loginAs('admin');
    cy.get(SELECTORS.cardsViewIcon).click();

    searchFor(titleAEdited);
    cy.contains(SELECTORS.card, titleAEdited).within(() => {
      cy.contains('button', 'Eliminar').click();
    });
    cy.get(SELECTORS.dialog).should('be.visible').as('deleteDialog');
    cy.get('@deleteDialog')
      .contains(`¿Eliminar ${titleAEdited}?`)
      .should('be.visible');
    cy.get('@deleteDialog').contains('button', 'Eliminar').click();
    cy.reload();
    cy.contains(titleAEdited).should('not.exist');

    switchToCardsView();
    searchFor(titleB);
    cy.contains(SELECTORS.card, titleB).within(() => {
      cy.contains('button', 'Eliminar').click();
    });
    cy.get(SELECTORS.dialog).should('be.visible').as('deleteDialogB');
    cy.get('@deleteDialogB')
      .contains(`¿Eliminar ${titleB}?`)
      .should('be.visible');
    cy.get('@deleteDialogB').contains('button', 'Eliminar').click();
    cy.reload();
    cy.contains(titleB).should('not.exist');
  });
});
