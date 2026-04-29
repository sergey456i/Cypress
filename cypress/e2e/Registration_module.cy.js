describe('Регистрация', () => {
    const REGISTRATION_URL = 'https://dev.profteam.su/registration';

    beforeEach(() => {
        cy.visit(REGISTRATION_URL);
    });

    it('Успешная регистрация с нормальными данными', () => {

        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const randomLetters = Array.from({ length: 5 }, () =>
            letters[Math.floor(Math.random() * letters.length)]
        ).join('');
        const uid = Date.now();
        const email = `rand.user.${uid}@icloud.com`;
        const login = `rand_user${randomLetters}`;
        const password = 'QWEasd123!';

        cy.get('[autocomplete="email"]').type(email);
        cy.get('[autocomplete="username"]').type(login);
        cy.get('[autocomplete="new-password"]').first().type(password);
        cy.get('[autocomplete="new-password"]').last().type(password);

        cy.get('form').contains('button', 'Далее').should('not.be.disabled').click();

        cy.get('[autocomplete="family-name"]').type('Тимофеев');
        cy.get('[autocomplete="given-name"]').type('Сергей ');
        cy.get('[autocomplete="additional-name"]').type('Дмитриевич');

        cy.get('form').contains('button', 'Создать аккаунт').should('not.be.disabled').click();
    });

    it('Пустые обязательные поля', () => {
        cy.get('form').contains('button', 'Далее').should('be.disabled');

        cy.get('[autocomplete="email"]').focus().blur();
        cy.get('[autocomplete="username"]').focus().blur();
        cy.get('[autocomplete="new-password"]').first().focus().blur();
    });

    it('Неверный формат Email', () => {
        cy.get('[autocomplete="email"]').type('email').blur();
        cy.get('[autocomplete="username"]').type('login');
        cy.get('[autocomplete="new-password"]').first().type('QWEasd123!');
        cy.get('[autocomplete="new-password"]').last().type('QWEasd123!');

        cy.get('form').contains('button', 'Далее').should('be.disabled');
        cy.contains('Обязательное поле, некорректная почта').should('be.visible');
    });

    it('Неправильный пароль', () => {
        cy.get('[autocomplete="email"]').type('User1@gmail.com');
        cy.get('[autocomplete="username"]').type('login');
        cy.get('[autocomplete="new-password"]').first().type('pass').blur();
        cy.get('[autocomplete="new-password"]').last().type('pass');

        cy.get('form').contains('button', 'Далее').should('be.disabled');
        cy.contains('Обязательное поле, мин 6 символов, должен содержать буквы в верхнем и нижнем регистре, минимум 1 цифру, не содержать пробелы').should('be.visible');
    });

    it('Пароли не совпадают', () => {
        cy.get('[autocomplete="email"]').type('User1@gmail.com');
        cy.get('[autocomplete="username"]').type('login');
        cy.get('[autocomplete="new-password"]').first().type('QWEasd123!');
        cy.get('[autocomplete="new-password"]').last().type('QWeasd123').blur();

        cy.get('form').contains('button', 'Далее').should('be.disabled');
        cy.contains('Пароли не совпадают').should('be.visible');
    });

    it('Не правильный логин', () => {
        cy.get('[autocomplete="email"]').type('User1@gmail.com');
        cy.get('[autocomplete="username"]').type('Юсер').blur();
        cy.get('[autocomplete="new-password"]').first().type('QWEasd123!');
        cy.get('[autocomplete="new-password"]').last().type('QWEasd123!');

        cy.get('form').contains('button', 'Далее').should('be.disabled');
        cy.contains('Обязательное поле, символы латиницы, не содержит пробелы').should('be.visible');
    });

    it('Не правильное ФИО', () => {
        cy.get('[autocomplete="email"]').type('User1@gmail.com');
        cy.get('[autocomplete="username"]').type('Rdvsdssdf_login_befgfg');
        cy.get('[autocomplete="new-password"]').first().type('QWEasd123!');
        cy.get('[autocomplete="new-password"]').last().type('QWEasd123!');
        cy.get('form').contains('button', 'Далее').should('not.be.disabled').click();

        cy.get('[autocomplete="family-name"]').type('Timofeev').blur();

        cy.get('form').contains('button', 'Создать аккаунт').should('be.disabled');
        cy.contains('Обязательное поле, кириллица, тире, апостроф и пробелы').should('be.visible');
    });
});

describe('Смена роли', () => {
    const LOGIN_URL = 'https://dev.profteam.su/login';

    beforeEach(() => {
        cy.visit(LOGIN_URL);
    });

    it('Успешная смена роли', () => {


        cy.get('[autocomplete="username"]').type('QuIsty');
        cy.get('[autocomplete="current-password"]').type('QWEasd123!');

        cy.get('form').contains('button', ' Войти ').should('not.be.disabled').click();
        cy.wait(1000)

        cy.get('.page-nav__role-block button', { timeout: 10000 })
            .should('be.visible')
            .should('not.be.disabled')
            .click();
        cy.get('div').contains('p', 'Я являюсь студентом').should('not.be.disabled').click();
    });
});


