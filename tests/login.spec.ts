import { expect } from '@playwright/test';;
import creds from '../creds.json';
import { faker } from '@faker-js/faker';
import { errorMessages } from '../helper/constans';
import { test } from '../fixtures/fixtures';

test.beforeEach(async ({loginPage}) => {
  await loginPage.goTo();
});

test.describe('Login tests | Positive', () => {
  test('Login with valid credentials', async ({loginPage, basePage}) => { 
    await loginPage.loginUser(creds.email, creds.password)
    await expect(basePage.profileLink).toHaveText(creds.username);
  });
});

test.describe('Login tests | Negative', () => {
  test('Should NOT login with invalid credentials', async ({loginPage, basePage}) => { 
    const invalidEmail = `123${faker.internet.email()}`
    const invalidPassword = `123${faker.internet.password()}`

    await loginPage.loginUser(invalidEmail, invalidPassword)
    await expect(basePage.errorMessage).toBeVisible();
    await expect(basePage.errorMessage).toHaveText(errorMessages.emailOrPassword);
  });

  test('Should NOT login with empty password', async ({loginPage, basePage}) => {
    await loginPage.loginUser(creds.email, '')
    await expect(basePage.errorMessage).toBeVisible();
    await expect(basePage.errorMessage).toHaveText(errorMessages.passwordBlank);
  });

  test('Should NOT login with empty email', async ({loginPage, basePage}) => {
    await loginPage.loginUser('', creds.password)
    await expect(basePage.errorMessage).toBeVisible();
    await expect(basePage.errorMessage).toHaveText(errorMessages.emailBlank);

  });

  test('Should NOT login with empty fields', async ({loginPage, basePage}) => { 
    await loginPage.loginUser('', '')
    await expect(basePage.errorMessage).toBeVisible();
    await expect(basePage.errorMessage).toHaveText(errorMessages.emailBlank);
  });
});