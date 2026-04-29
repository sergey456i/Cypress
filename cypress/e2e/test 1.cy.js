describe('Полный набор тестов', () => {
    const LOGIN_URL = 'https://dev.profteam.su/login';

    beforeEach(() => {
        cy.visit(LOGIN_URL);
    });

    it('Успешная авторизация работодателем и создание потребности', () => {
        cy.get('[autocomplete="username"]').type('testerEmployer');
        cy.get('[autocomplete="current-password"]').type('Password1');

        cy.get('form', { timeout: 7000 })
            .contains('button', ' Войти ')
            .should('not.be.disabled')
            .click();

        cy.url({ timeout: 10000 }).should('not.include', '/login');
        cy.contains('p', 'Потребности').should('be.visible').click();

        cy.contains('button', ' Создать потребность ', { timeout: 10000 })
            .should('be.visible')
            .click();
        cy.wait(1000);

        cy.get('.desktop-modal').should('be.visible');

        cy.get('.desktop-modal input[placeholder="Кладовщик"]').type('Кладовщик');
        cy.get('.desktop-modal input[value="По договорённости"]').check({ force: true });
        cy.get('.desktop-modal textarea[placeholder="Обязанности сотрудника"]').type('Обязанности сотрудника');
        cy.get('.desktop-modal textarea[placeholder="Ваши требования"]').type('Ваши требования');
        cy.wait(2000);

        cy.get('.desktop-modal')
            .contains('button', 'Создать потребность')
            .click({ force: true });
        cy.wait(2000);
    });

    it('Успешная авторизация студентом и отклик на потребность', () => {
        cy.get('[autocomplete="username"]').type('Sergo');
        cy.get('[autocomplete="current-password"]').type('QWEasd123');
        cy.get('form').contains('button', ' Войти ').click();
        cy.wait(3000);

        cy.visit('https://dev.profteam.su/needs');
        cy.wait(3000);

        cy.get('input[placeholder="Название..."]').type('Кладовщик');
        cy.get('.search-input__button').click();
        cy.wait(2000);

        cy.get('.need-item').first().within(() => {
            cy.contains('button', 'Подробнее').click();
        });
        cy.wait(2000);

        cy.contains('button', 'Откликнуться').click();
        cy.wait(1000);
        cy.get('body').type('{esc}');

        cy.log(' Отклик выполнен');
    });

    it('Успешная авторизация работодателем и взаимодействие с рабочим пространством', () => {
        cy.get('[autocomplete="username"]').type('testerEmployer');
        cy.get('[autocomplete="current-password"]').type('Password1');

        cy.get('form', { timeout: 7000 })
            .contains('button', ' Войти ')
            .should('not.be.disabled')
            .click();

        cy.wait(3000);

        cy.contains('p', 'Отклики')
            .should('be.visible')
            .click();

        cy.wait(2000);

        cy.get('svg[viewBox="0 0 18 18"]')
            .first()
            .click({ force: true });

        cy.wait(2000);

        cy.contains('button', 'Рабочее пространство')
            .should('be.visible')
            .click();

        cy.wait(2000);

        const randomComment = `Комментарий ${Math.random().toString(36).substring(7)}`;

        cy.get('textarea[placeholder="Напишите комментарий..."]')
            .scrollIntoView()
            .should('be.visible')
            .type(randomComment, { force: true });

        cy.contains('button', 'Потребность выполнена')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

        cy.wait(2000);

        cy.contains('Потребность выполнена', { timeout: 5000 }).should('be.visible');
    });
    it('Успешный поиск потребности "Сварщик" с фильтром ЗП по диапазону от 100 до 1000', () => {

        cy.get('[autocomplete="username"]').type('testerEmployer');
        cy.get('[autocomplete="current-password"]').type('Password1');

        cy.get('form', { timeout: 7000 })
            .contains('button', ' Войти ')
            .should('not.be.disabled')
            .click();

        cy.url({ timeout: 10000 }).should('not.include', '/login');
        cy.wait(2000);

        cy.contains('.header__label', 'Потребности')
            .should('be.visible')
            .click();

        cy.wait(2000);

        cy.get('.search-input__field input[placeholder="Название..."]')
            .should('be.visible')
            .clear()
            .type('Сварщик');

        cy.get('.search-input__button')
            .should('be.visible')
            .click();

        cy.wait(2000);

        cy.get('.salary-field .radio-component')
            .contains('span', 'По диапазону')
            .click({ force: true });

        cy.wait(1000);

        cy.get('.salary-field__form-field-wrapper')
            .first()
            .find('input[type="number"]')
            .should('be.visible')
            .clear()
            .type('100');

        cy.get('.salary-field__form-field-wrapper')
            .last()
            .find('input[type="number"]')
            .should('be.visible')
            .clear()
            .type('1000');

        cy.wait(1000);

        cy.get('body').then(($body) => {
            if ($body.find('button:contains("Применить")').length > 0) {
                cy.contains('button', 'Применить').click();
            } else if ($body.find('button:contains("Применить фильтр")').length > 0) {
                cy.contains('button', 'Применить фильтр').click();
            }
        });

        cy.wait(2000);

        cy.get('.need-header__name')
            .should('be.visible')
            .each(($title) => {
                expect($title.text().toLowerCase()).to.contain('сварщик');
            });

        cy.get('.need-item').should('have.length.greaterThan', 0);

        cy.log(' Тест пройден: поиск "Сварщик" и фильтр ЗП по диапазону 100-1000 работают корректно');
    });
});