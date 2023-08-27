/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />
describe('Тестирование приложения игры в пары. В начальном состоянии игра должна иметь поле четыре на четыре клетки, в каждой клетке цифра должна быть невидима.', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/');
    cy.get('.js-test-input-x').should('contain.value', 4);
    cy.get('.js-test-input-y').should('contain.value', 4);
    cy.contains('Начать').click();
  });

  it('Нажать на одну произвольную карточку. Убедиться, что она осталась открытой.', () => {
    cy.get('.field .field-card:first-child').click();
    cy.get('.field .field-card:first-child').should(
      'have.class',
      'field-card_open'
    );
  });

  it('Нажать на левую верхнюю карточку, затем на следующую. Если это не пара, то повторять со следующей карточкой, пока не будет найдена пара. Проверить, что найденная пара карточек осталась видимой.', () => {
    cy.get('.field .field-card:first-child').as('firstCard');
    const nextCard = cy.get('@firstCard');

    const checkPairOfCards = () => {
      cy.get('@firstCard').then(($ele) => {
        if (!$ele.hasClass('field-card_open')) {
          cy.get('@firstCard').click();
          nextCard.next();
          nextCard.click();

          cy.get('@firstCard').then(($firstCard) => {
            const firstCardNumber = $firstCard.text();
            nextCard.then(($nextCard) => {
              const nextCardNumber = $nextCard.text();
              if (firstCardNumber === nextCardNumber) {
                cy.get('@firstCard').should('have.class', 'field-card_open');
                nextCard.should('have.class', 'field-card_open');
                expect(firstCardNumber).to.equal(nextCardNumber);
              }
            });
            cy.wait(400);
            checkPairOfCards();
          });
        }
      });
    };
    checkPairOfCards();
  });

  it('Нажать на левую верхнюю карточку, затем на следующую. Если это пара, то повторять со следующими двумя карточками, пока не найдутся непарные карточки. Проверить, что после нажатия на вторую карточку обе становятся невидимыми.', () => {
    let startCard = 1;

    const checkCard = () => {
      cy.get(`.field .field-card:nth-child(${startCard})`).as('firstCard');
      cy.get(`.field .field-card:nth-child(${startCard + 1})`).as('nextCard');

      cy.get('@firstCard').click();
      cy.get('@nextCard').click();

      cy.get('@firstCard').then(($firstCard) => {
        const firstCardNumber = $firstCard.text();
        cy.get('@nextCard').then(($nextCard) => {
          const nextCardNumber = $nextCard.text();
          if (firstCardNumber !== nextCardNumber) {
            cy.wait(400);
            cy.get('@firstCard').should('not.have.class', 'field-card_open');
            cy.get('@nextCard').should('not.have.class', 'field-card_open');
            expect(firstCardNumber).not.to.eq(nextCardNumber);
          } else {
            startCard += 2;
            checkCard();
          }
        });
      });
    };
    checkCard();
  });
});
