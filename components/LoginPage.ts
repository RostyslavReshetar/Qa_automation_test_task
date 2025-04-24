import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
    emailField: Locator;
    passwordField: Locator;
    loginButton: Locator;

    constructor(page: Page) {
        super(page);
        this.emailField = page.getByPlaceholder('Email')
        this.passwordField = page.getByPlaceholder('Password')
        this.loginButton = page.getByRole('button', { name: 'Sign in' })
    }

    async goTo() {
        await this.page.goto('/user/login');
    }

    async loginUser(username: string, password: string) {
        await this.emailField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
        await this.page.waitForResponse('**/api/users/login**');
    }

}