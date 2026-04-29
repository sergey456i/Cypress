describe('Авторизация', () => {
    const LOGIN_URL = 'https://dev.profteam.su/login';

    beforeEach(() => {
        cy.visit(LOGIN_URL);
    });

    it('Успешная авторизация', () => {
        cy.get('[autocomplete="username"]').type('QuIsty');
        cy.get('[autocomplete="current-password"]').type('QWEasd123!');

        cy.get('form').contains('button', ' Войти ').should('not.be.disabled').click();
    });

    it('Пустые обязательные поля', () => {
        cy.get('form').contains('button', ' Войти ').should('be.disabled');

        cy.get('[autocomplete="username"]').focus().blur();
        cy.get('[autocomplete="current-password"]').first().focus().blur();
    });

    it('Несуществующий пользователь', () => {
        cy.get('[autocomplete="username"]').type('Qu1sty');
        cy.get('[autocomplete="current-password"]').type('QWEasd123!');
        cy.get('form').contains('button', ' Войти ').should('be.disabled').click();
        cy.contains('Неверный логин или пароль, попробуйте заново.').should('be.visible');
    });

});