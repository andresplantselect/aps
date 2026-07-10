import { faker } from '@faker-js/faker';

import { SELECTORS } from '../support/selectors';

// Shared tag so a single search shows both visible products at once —
// neither needs to be filtered out of the DOM to look up the other, which
// matters once cart state (and the aliases pointing at each card) needs to
// survive across several interactions.
const runTag = faker.string.alphanumeric(6);
const titleHidden = `Cypress Hidden ${runTag}`;
const titleVisibleNoUnits = `Cypress Boxes ${runTag}`;
const titleVisibleWithUnits = `Cypress Units ${runTag}`;

function searchFor(term: string) {
  cy.get(SELECTORS.searchInput).clear().type(term);
}

function switchToTableView() {
  cy.get(SELECTORS.tableViewIcon).click();
}

function switchToCardsView() {
  cy.get(SELECTORS.cardsViewIcon).click();
}

function waitForProductCard(title: string) {
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

function createProduct(fields: {
  title: string;
  price: string;
  unitsPerBox: string;
  available: string;
  canBuyUnits?: boolean;
  isVisible?: boolean;
}) {
  switchToTableView();
  cy.contains('button', /^Añadir$/).click();
  fillCreateProductForm(fields);
  cy.contains('button', 'Agregar').click();
  cy.contains(`Artículo ${fields.title} agregado.`).should('be.visible');
  waitForProductCard(fields.title);
}

function cleanupTestProducts() {
  cy.task('deleteTestProducts', 'Cypress ');
}

// Clicks the +/- stepper for a "Cajas:"/"Unidades:" row inside the given
// scope (a product card or a cart line item both use the same row layout).
function clickStepper(
  scope: string,
  rowLabel: 'Cajas:' | 'Unidades:',
  direction: 'add' | 'remove',
) {
  const icon = direction === 'add' ? SELECTORS.plusIcon : SELECTORS.minusIcon;
  cy.get(scope).contains(rowLabel).parent().find(icon).click();
}

function clickClearCart(scope: string) {
  cy.get(scope).find(SELECTORS.clearCartIcon).click();
}

// The "{n} Uds" / "{price} €" total is easy to confuse with the "Disponible:
// N Uds" text, since e.g. "Disponible: 30 Uds" also contains "0 Uds" as a
// substring. Scope precisely to the row via the "Total" label instead of a
// loose page-wide text search.
function assertTotal(scope: string, units: number, price: string) {
  cy.get(scope)
    .contains(/^Total/)
    .parent()
    .find('p')
    .eq(1)
    .should('have.text', `${units} Uds`);
  cy.get(scope)
    .contains(/^Total/)
    .parent()
    .find('p')
    .eq(2)
    .should('have.text', `${price} €`);
}

// The cart panel renders one AddItemsCard per item with its title as plain
// text, followed by the steppers/total in a sibling Stack — so the full item
// block is two levels up from the title text node. Scoped to the cart
// dialog alias so it never matches the (portalled-away) card behind it.
function cartItemFor(title: string) {
  return cy.get('@cart').contains(title).parents().eq(1);
}

function openCart() {
  cy.get(SELECTORS.fab).click();
}

describe('Order flow: catalog visibility, buy-units controls, and cart behavior for users', () => {
  after(cleanupTestProducts);

  it('lets an admin create a hidden product, a boxes-only product, and a boxes+units product', () => {
    cy.loginAs('admin');

    createProduct({
      title: titleHidden,
      price: '5.00',
      unitsPerBox: '2',
      available: '10',
      isVisible: false,
    });

    createProduct({
      title: titleVisibleNoUnits,
      price: '2.00',
      unitsPerBox: '5',
      available: '30',
    });

    createProduct({
      title: titleVisibleWithUnits,
      price: '4.00',
      unitsPerBox: '6',
      available: '40',
      canBuyUnits: true,
    });
  });

  it('only shows the two visible products to a regular user, and only the loose-units one shows the "Unidades" stepper', () => {
    cy.loginAs('user');

    cy.contains(titleHidden).should('not.exist');

    searchFor(runTag);
    cy.contains(SELECTORS.card, titleVisibleNoUnits).within(() => {
      cy.contains('Cajas:').should('be.visible');
      cy.contains('Unidades:').should('not.exist');
    });
    cy.contains(SELECTORS.card, titleVisibleWithUnits).within(() => {
      cy.contains('Cajas:').should('be.visible');
      cy.contains('Unidades:').should('be.visible');
    });
  });

  it('deducts stock, totals correctly on the card, clears from the card, and stays in sync with the cart panel', () => {
    cy.loginAs('user');
    searchFor(runTag);

    cy.contains(SELECTORS.card, titleVisibleNoUnits).as('boxesCard');
    cy.contains(SELECTORS.card, titleVisibleWithUnits).as('unitsCard');

    // Boxes-only product: add 2 boxes (10 units).
    cy.get('@boxesCard').contains('Disponible: 30 Uds').should('be.visible');
    clickStepper('@boxesCard', 'Cajas:', 'add');
    clickStepper('@boxesCard', 'Cajas:', 'add');
    cy.get('@boxesCard').contains('Disponible: 20 Uds').should('be.visible');
    assertTotal('@boxesCard', 10, '20.00');

    // Boxes+units product: 1 box (6) + 3 loose units = 9 units.
    cy.get('@unitsCard').contains('Disponible: 40 Uds').should('be.visible');
    clickStepper('@unitsCard', 'Cajas:', 'add');
    clickStepper('@unitsCard', 'Unidades:', 'add');
    clickStepper('@unitsCard', 'Unidades:', 'add');
    clickStepper('@unitsCard', 'Unidades:', 'add');
    cy.get('@unitsCard').contains('Disponible: 31 Uds').should('be.visible');
    assertTotal('@unitsCard', 9, '36.00');

    // Clearing from the card resets that product's quantity and available
    // stock, without touching the other product.
    clickClearCart('@boxesCard');
    cy.get('@boxesCard').contains('Disponible: 30 Uds').should('be.visible');
    assertTotal('@boxesCard', 0, '0.00');
    cy.get('@unitsCard').contains('Disponible: 31 Uds').should('be.visible');

    // Re-add 3 boxes to the boxes-only product so both items are in the
    // cart again.
    clickStepper('@boxesCard', 'Cajas:', 'add');
    clickStepper('@boxesCard', 'Cajas:', 'add');
    clickStepper('@boxesCard', 'Cajas:', 'add');
    cy.get('@boxesCard').contains('Disponible: 15 Uds').should('be.visible');
    assertTotal('@boxesCard', 15, '30.00');

    // Open the cart and confirm both items show the same quantities/totals.
    openCart();
    cy.get(SELECTORS.dialog).should('be.visible').as('cart');
    cy.get('@cart').contains('Tu pedido').should('be.visible');

    cartItemFor(titleVisibleNoUnits).as('boxesCartItem');
    assertTotal('@boxesCartItem', 15, '30.00');

    cartItemFor(titleVisibleWithUnits).as('unitsCartItem');
    assertTotal('@unitsCartItem', 9, '36.00');

    cy.get('@cart').contains('Total:').should('be.visible');
    cy.get('@cart').contains('€ 66.00').should('be.visible');

    // Changing the quantity from inside the cart updates both the cart
    // item and the underlying product card, since they share the same
    // cart state. The grid card behind the dialog is only covered, not
    // unmounted, so its text still updates — check content rather than
    // visibility since the modal backdrop sits on top of it.
    clickStepper('@boxesCartItem', 'Cajas:', 'add');
    assertTotal('@boxesCartItem', 20, '40.00');
    cy.get('@boxesCard').should('contain.text', 'Disponible: 10 Uds');
    assertTotal('@boxesCard', 20, '40.00');
    cy.get('@cart').contains('€ 76.00').should('be.visible');

    // Clearing an item from the cart panel removes it from the cart
    // entirely and recalculates the total.
    clickClearCart('@unitsCartItem');
    cy.get('@cart').contains(titleVisibleWithUnits).should('not.exist');
    cy.get('@cart').contains('€ 40.00').should('be.visible');
    cy.get('@unitsCard').should('contain.text', 'Disponible: 40 Uds');
  });
});
