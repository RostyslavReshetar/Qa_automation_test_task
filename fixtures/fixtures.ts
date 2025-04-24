// fixtures.ts
import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../components/loginPage';
import { ArticlePage } from '../components/ArticlePage';
import { BasePage } from '../components/basePage';

type MyFixtures = {
  basePage: BasePage;
  loginPage: LoginPage;
  articlePage: ArticlePage;
};

export const test = baseTest.extend<MyFixtures>({
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },
});
