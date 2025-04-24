import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../components/loginPage';
import creds from '../creds.json';
import { BasePage } from '../components/basePage';
import { faker } from '@faker-js/faker';
import { errorMessages } from '../helper/constans';

let basePage: BasePage
let loginPage: LoginPage;
let page: Page;


test.beforeAll(async ({browser}) => {
  page = await browser.newPage();
  basePage = new BasePage(page);
  loginPage = new LoginPage(page);
});

test.beforeEach(async () => {
  await loginPage.goTo();
});

test.describe('Login tests | Positive', () => {
  test('Login with valid credentials', async () => { 
    await loginPage.loginUser(creds.email, creds.password)
    await expect(basePage.profileLink).toHaveText(creds.username);
  });
});


test.describe('Login tests | Negative', () => {
  test('Should NOT login with invalid credentials', async () => { 
    const invalidEmail = `123${faker.internet.email()}`
    const invalidPassword = `123${faker.internet.password()}`

    await loginPage.loginUser(invalidEmail, invalidPassword)
    await expect(basePage.errorMessage).toBeVisible();
    await expect(basePage.errorMessage).toHaveText(errorMessages.emailOrPassword);
  });

  test('Should NOT login with empty password', async () => {
    await loginPage.loginUser(creds.email, '')
    await expect(basePage.errorMessage).toBeVisible();
    await expect(basePage.errorMessage).toHaveText(errorMessages.passwordBlank);
  });

  test('Should NOT login with empty email', async () => {
    await loginPage.loginUser('', creds.password)
    await expect(basePage.errorMessage).toBeVisible();
    await expect(basePage.errorMessage).toHaveText(errorMessages.emailBlank);

  });

  test('Should NOT login with empty fields', async () => { 
    await loginPage.loginUser('', '')
    await expect(basePage.errorMessage).toBeVisible();
    await expect(basePage.errorMessage).toHaveText(errorMessages.emailBlank);
  });
});