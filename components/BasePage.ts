import { Locator, Page } from '@playwright/test';

export class BasePage {
    page: Page;
    profileLink: Locator;
    errorMessage: Locator;
    H1: Locator;
    tagList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.profileLink = page.getByRole('link', { name: 'your profile image' });
        this.errorMessage = page.locator('.error-messages');
        this.H1 = page.locator('h1');
    }
}