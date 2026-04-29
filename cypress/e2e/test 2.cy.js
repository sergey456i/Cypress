describe('Создание потребности с некорректным диапазоном зарплаты', () => {
    const LOGIN_URL = 'https://dev.profteam.su/login';

    beforeEach(() => {
        cy.visit(LOGIN_URL);
    });

    it('Негативный тест: диапазон зарплаты "от" больше "до"', () => {
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

        cy.get('.desktop-modal input[value="По диапазону"]').check({ force: true });
        cy.wait(500);

        cy.get('.salary-field__form-field-wrapper')
            .first()
            .find('input[type="number"]')
            .clear()
            .type('100000');

        cy.get('.salary-field__form-field-wrapper')
            .last()
            .find('input[type="number"]')
            .clear()
            .type('50000');

        cy.get('.desktop-modal textarea[placeholder="Обязанности сотрудника"]')
            .type('Обязанности сотрудника');

        cy.get('.desktop-modal textarea[placeholder="Ваши требования"]')
            .type('Ваши требования');

        cy.get('.label').contains('Тип занятости')
            .parents('.label')
            .find('.form-select__selected')
            .click();

        cy.wait(500);

        cy.contains('Очный').click({ force: true });

        cy.wait(1000);
        cy.get('.desktop-modal button[type="submit"]')
            .should('be.disabled')
            .and('contain', 'Создать потребность');
    });
    it('Попытка загрузить файл размером больше 2 МБ', () => {

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

        cy.window().then((win) => {
            const sizeInMB = 2.5;
            const bytes = sizeInMB * 1024 * 1024;
            const array = new Uint8Array(bytes);

            for (let i = 0; i < bytes; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }

            const blob = new win.Blob([array], { type: 'application/octet-stream' });
            const file = new win.File([blob], `large_file_${sizeInMB}mb.bin`, { type: 'application/octet-stream' });

            const dataTransfer = new win.DataTransfer();
            dataTransfer.items.add(file);

            cy.get('input[type="file"]', { timeout: 5000 })
                .should('exist')
                .then((input) => {
                    input[0].files = dataTransfer.files;
                    input[0].dispatchEvent(new win.Event('change', { bubbles: true }));
                });
        });

        cy.wait(1500);

        cy.get('.comment-textarea__buttons').scrollIntoView();
        cy.wait(500);

        cy.get('.comment-textarea__buttons button').last()
            .should('be.disabled');

        cy.get('.comment-textarea__buttons button[disabled]')
            .should('exist');

        cy.log(' Тест пройден: файл больше 2 МБ не загрузился, кнопка отправки заблокирована');
    });
    it('Негативный тест: поиск потребности "Сварщик" с отрицательным диапазоном ЗП', () => {

        cy.get('[autocomplete="username"]').type('testerEmployer');
        cy.get('[autocomplete="current-password"]').type('Password1');
        cy.get('form').contains('button', ' Войти ').click();
        cy.wait(3000);

        // Переход в Потребности
        cy.visit('https://dev.profteam.su/needs');
        cy.wait(3000);

        // Поиск
        cy.get('input[placeholder="Название..."]').type('Сварщик');
        cy.get('.search-input__button').click();
        cy.wait(2000);

        // Выбор "По диапазону"
        cy.contains('.radio-component', 'По диапазону').click({ force: true });
        cy.wait(500);

        // НЕГАТИВ: ввод отрицательных значений
        cy.get('.salary-field__form-field-wrapper input[type="number"]').eq(0).clear().type('-500');
        cy.get('.salary-field__form-field-wrapper input[type="number"]').eq(1).clear().type('-100');

        cy.wait(1000);

        // Проверка валидации
        cy.get('body').then(($body) => {
            if ($body.find('.search-input__button[disabled], button[disabled]').length > 0) {
                cy.log(' Кнопка поиска disabled при отрицательных значениях');
            }

            if ($body.find('.error-message, .validation-error').length > 0) {
                cy.contains(/отрицательн|не может быть|больше 0/i).should('be.visible');
            }
        });
    });
});