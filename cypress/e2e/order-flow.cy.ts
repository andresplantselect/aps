import { faker } from '@faker-js/faker';

import { SELECTORS } from '../support/selectors';

const runTag = faker.string.alphanumeric(6);
const titleHidden = `Cypress Hidden ${runTag}`;
const titleVisibleNoUnits = `Cypress Boxes ${runTag}`;
const titleVisibleWithUnits = `Cypress Units ${runTag}`;
const orderComment = `Cypress Order Test ${runTag}`;
const orderComment2 = `Cypress Order Test ${runTag} 2`;
const orderComment3 = `Cypress Order Test ${runTag} 3`;

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

function cartItemFor(title: string) {
  return cy.get('@cart').contains(title).parents().eq(1);
}

function openCart() {
  cy.get(SELECTORS.fab).click();
}

function preorderCardForComment(comment: string) {
  return cy.contains(comment).closest('.MuiAccordion-root');
}

function preorderRowForComment(comment: string) {
  return cy.contains(comment).closest('tr');
}

function approveOrder(comment: string) {
  preorderRowForComment(comment).find(SELECTORS.checkIcon).parent().click();
  cy.get(SELECTORS.dialog).contains('button', 'Aprobar').click();
  cy.get(SELECTORS.dialog).should('not.exist');
}

function rejectOrder(comment: string) {
  preorderRowForComment(comment).find(SELECTORS.clearIcon).parent().click();
  cy.get(SELECTORS.dialog).contains('button', 'Rechazar').click();
  cy.get(SELECTORS.dialog).should('not.exist');
}

function submitOrder(comment: string) {
  openCart();
  cy.get(SELECTORS.dialog).should('be.visible').as('cart');
  cy.getByLabel('Comentario (opcional)').type(comment);
  cy.contains('button', 'Reservar').click();
  cy.contains('Pedido enviado con éxito.').should('be.visible');
  cy.get(SELECTORS.dialog).should('not.exist');
}

describe('Order flow: catalog visibility, buy-units controls, and cart behavior for users', () => {
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

    cy.get('@boxesCard').contains('Disponible: 30 Uds').should('be.visible');
    clickStepper('@boxesCard', 'Cajas:', 'add');
    clickStepper('@boxesCard', 'Cajas:', 'add');
    cy.get('@boxesCard').contains('Disponible: 20 Uds').should('be.visible');
    assertTotal('@boxesCard', 10, '20.00');

    cy.get('@unitsCard').contains('Disponible: 40 Uds').should('be.visible');
    clickStepper('@unitsCard', 'Cajas:', 'add');
    clickStepper('@unitsCard', 'Unidades:', 'add');
    clickStepper('@unitsCard', 'Unidades:', 'add');
    clickStepper('@unitsCard', 'Unidades:', 'add');
    cy.get('@unitsCard').contains('Disponible: 31 Uds').should('be.visible');
    assertTotal('@unitsCard', 9, '36.00');

    clickClearCart('@boxesCard');
    cy.get('@boxesCard').contains('Disponible: 30 Uds').should('be.visible');
    assertTotal('@boxesCard', 0, '0.00');
    cy.get('@unitsCard').contains('Disponible: 31 Uds').should('be.visible');

    clickStepper('@boxesCard', 'Cajas:', 'add');
    clickStepper('@boxesCard', 'Cajas:', 'add');
    clickStepper('@boxesCard', 'Cajas:', 'add');
    cy.get('@boxesCard').contains('Disponible: 15 Uds').should('be.visible');
    assertTotal('@boxesCard', 15, '30.00');

    openCart();
    cy.get(SELECTORS.dialog).should('be.visible').as('cart');
    cy.get('@cart').contains('Tu pedido').should('be.visible');

    cartItemFor(titleVisibleNoUnits).as('boxesCartItem');
    assertTotal('@boxesCartItem', 15, '30.00');

    cartItemFor(titleVisibleWithUnits).as('unitsCartItem');
    assertTotal('@unitsCartItem', 9, '36.00');

    cy.get('@cart').contains('Total:').should('be.visible');
    cy.get('@cart').contains('€ 66.00').should('be.visible');

    clickStepper('@boxesCartItem', 'Cajas:', 'add');
    assertTotal('@boxesCartItem', 20, '40.00');
    cy.get('@boxesCard').should('contain.text', 'Disponible: 10 Uds');
    assertTotal('@boxesCard', 20, '40.00');
    cy.get('@cart').contains('€ 76.00').should('be.visible');

    clickClearCart('@unitsCartItem');
    cy.get('@cart').contains(titleVisibleWithUnits).should('not.exist');
    cy.get('@cart').contains('€ 40.00').should('be.visible');
    cy.get('@unitsCard').should('contain.text', 'Disponible: 40 Uds');
  });

  it('submits an order with a comment and logs a notification for both the admin and the user', () => {
    cy.loginAs('user');
    searchFor(runTag);

    cy.contains(SELECTORS.card, titleVisibleNoUnits).as('boxesCard');
    clickStepper('@boxesCard', 'Cajas:', 'add');
    clickStepper('@boxesCard', 'Cajas:', 'add');
    assertTotal('@boxesCard', 10, '20.00');

    submitOrder(orderComment);

    cy.task('getOrderByComment', orderComment).then((order) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- chai assertion
      expect(order, 'order matching the test comment').to.not.be.null;
      const {
        id: orderId,
        total,
        status,
      } = order as {
        id: number;
        total: number;
        status: string;
      };
      expect(Number(total)).to.eq(20);
      expect(status).to.eq('pending');

      cy.task(
        'getNotificationsForOrder',
        { orderId, minRows: 2, timeoutMs: 15000 },
        { timeout: 20000 },
      ).then((rows) => {
        const typedRows = rows as {
          function_name: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic JSON payload from notifications_log
          payload: Record<string, any>;
        }[];
        const names = typedRows.map((r) => r.function_name);
        expect(names).to.include('send-email');
        expect(names).to.include('send-user-new-order-email');

        const adminNotification = typedRows.find(
          (r) => r.function_name === 'send-email',
        );
        const userNotification = typedRows.find(
          (r) => r.function_name === 'send-user-new-order-email',
        );

        expect(adminNotification?.payload?.order?.id).to.eq(orderId);
        expect(adminNotification?.payload?.order?.comment).to.eq(orderComment);
        expect(userNotification?.payload?.orderId).to.eq(orderId);
      });
    });
  });

  it('shows the submitted order under the "Pedidos" tab with the right status, total, item, and comment', () => {
    cy.loginAs('user');
    cy.contains('Pedidos').click();

    preorderCardForComment(orderComment).as('orderCard');
    cy.get('@orderCard').contains('Pendiente').should('be.visible');
    cy.get('@orderCard').contains('€ 20.00').should('be.visible');

    cy.get('@orderCard').click();
    cy.get('@orderCard').contains(titleVisibleNoUnits).should('be.visible');
    cy.get('@orderCard').contains('10 uds · € 2.00 / ud').should('be.visible');
    cy.get('@orderCard')
      .contains(`Cliente: ${orderComment}`)
      .should('be.visible');
  });

  it('shows the order in the admin "Pedidos" table with the right status, delivery status, action buttons, and item breakdown', () => {
    cy.loginAs('admin');
    cy.contains('Pedidos').click();

    cy.task('getOrderByComment', orderComment).then((order) => {
      const { id: orderId } = order as { id: number };

      preorderRowForComment(orderComment).as('orderRow');
      cy.get('@orderRow').contains(String(orderId)).should('be.visible');
      cy.get('@orderRow').contains('User Test').should('be.visible');
      cy.get('@orderRow')
        .contains(`Cliente: ${orderComment}`)
        .should('be.visible');
      cy.get('@orderRow').contains('Pendiente').should('be.visible');
      cy.get('@orderRow').contains('Pendiente de entrega').should('be.visible');

      cy.get('@orderRow')
        .find(SELECTORS.checkIcon)
        .parent()
        .should('not.be.disabled');
      cy.get('@orderRow')
        .find(SELECTORS.clearIcon)
        .parent()
        .should('not.be.disabled');
      cy.get('@orderRow')
        .find(SELECTORS.shippingIcon)
        .parent()
        .should('be.disabled');

      cy.get('@orderRow').find('button').first().click();
      cy.get('@orderRow').next('tr').as('orderDetails');
      cy.get('@orderDetails')
        .find('tbody tr')
        .first()
        .find('td')
        .as('itemCells');
      cy.get('@itemCells').eq(0).should('have.text', titleVisibleNoUnits);
      cy.get('@itemCells').eq(1).should('have.text', '€ 2.00');
      cy.get('@itemCells').eq(2).should('have.text', '2 Caj.');
      cy.get('@itemCells').eq(3).should('have.text', '10');
      cy.get('@itemCells').eq(4).should('have.text', '€ 20.00');
    });
  });

  it('admin approval flow: places two more orders via the API, then approves one and rejects the other, notifying the user for both', () => {
    const userEmail = Cypress.env('TEST_USER_EMAIL') as string;

    cy.task('createTestOrder', {
      userEmail,
      comment: orderComment2,
      items: [{ title: titleVisibleWithUnits, quantity: 8 }],
    }).then((order) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- chai assertion
      expect(order, 'order created via API').to.not.be.null;
    });

    cy.task('createTestOrder', {
      userEmail,
      comment: orderComment3,
      items: [{ title: titleVisibleNoUnits, quantity: 5 }],
    }).then((order) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- chai assertion
      expect(order, 'order created via API').to.not.be.null;
    });

    cy.loginAs('admin');
    cy.contains('Pedidos').click();

    approveOrder(orderComment2);
    preorderRowForComment(orderComment2)
      .contains('Aprobado')
      .should('be.visible');

    rejectOrder(orderComment3);
    preorderRowForComment(orderComment3)
      .contains('Rechazado')
      .should('be.visible');

    cy.task('getOrderByComment', orderComment2).then((order) => {
      const { id: orderId, status } = order as { id: number; status: string };
      expect(status).to.eq('approved');

      cy.task(
        'getNotificationsForOrder',
        { orderId, minRows: 1, timeoutMs: 15000 },
        { timeout: 20000 },
      ).then((rows) => {
        const names = (rows as { function_name: string }[]).map(
          (r) => r.function_name,
        );
        expect(names).to.include('send-user-order-status-email');
      });
    });

    cy.task('getOrderByComment', orderComment3).then((order) => {
      const { id: orderId, status } = order as { id: number; status: string };
      expect(status).to.eq('cancelled');

      cy.task(
        'getNotificationsForOrder',
        { orderId, minRows: 1, timeoutMs: 15000 },
        { timeout: 20000 },
      ).then((rows) => {
        const names = (rows as { function_name: string }[]).map(
          (r) => r.function_name,
        );
        expect(names).to.include('send-user-order-status-email');
      });
    });
  });
});
