import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../components/loginPage';
import creds from '../creds.json';
import { ArticleFields, ArticlePage } from '../components/ArticlePage';
import { BasePage } from '../components/basePage';
import { generateArticleData } from '../helper/helper';
import { errorMessages } from '../helper/constans';

let page: Page;
let basePage: BasePage
let loginPage: LoginPage;
let articlePage: ArticlePage;

test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    basePage = new BasePage(page);
    loginPage = new LoginPage(page);
    articlePage = new ArticlePage(page);

    await loginPage.goTo();
    await loginPage.loginUser(creds.email, creds.password)
});

test.beforeEach(async () => {
    await articlePage.goTo();
})

test.describe('Article tests | Positive', () => {
  test('Create article with all fields', async () => {
    const articleData: ArticleFields = generateArticleData(1);
    
    await articlePage.publishArticle(articleData);

    await expect(basePage.H1).toContainText(articleData.title);
    await expect(articlePage.articleContentBlock).toContainText(articleData.body);
    await expect(articlePage.tagList).toHaveCount((articleData.tagList ?? []).length);
  })

  test('Create article with required fields', async () => {
    const articleData: ArticleFields = generateArticleData(0);
    
    await articlePage.publishArticle(articleData);
    
    await expect(basePage.H1).toContainText(articleData.title);
    await expect(articlePage.articleContentBlock).toContainText(articleData.body);
    await expect(articlePage.tagList).toHaveCount(0);
  })

  test('Create article with tags separated by commas', async () => {
    const articleData: ArticleFields = generateArticleData(0);
    articleData.tagList = ['tag1, tag2, tag3'];
    
    await articlePage.publishArticle(articleData);
    await expect(basePage.H1).toContainText(articleData.title);

    articleData.tagList = articleData.tagList[0].split(',').map(tag => tag.trim());
    for (const [i, tag] of articleData.tagList.entries()) {
        await expect(articlePage.tagList.nth(i)).toContainText(tag);
    }
  })
});

test.describe('Article tests | Negative', () => {
    const testCases = [
        { name: 'missing title', article: { ...generateArticleData(0), title: '' }, expectedError: errorMessages.emptyTitle },
        { name: 'missing description', article: { ...generateArticleData(0), description: '' }, expectedError: errorMessages.emptyDescription },
        { name: 'missing body', article: { ...generateArticleData(0), body: '' }, expectedError: errorMessages.emptyBody },
        { name: 'missing title and description', article: { ...generateArticleData(0), title: '', description: '' }, expectedError:  errorMessages.emptyTitle },
        { name: 'missing title and body', article: { ...generateArticleData(0), title: '', body: '' }, expectedError:  errorMessages.emptyTitle },
        { name: 'missing description and body', article: { ...generateArticleData(0), description: '', body: '' }, expectedError: errorMessages.emptyDescription },
        { name: 'missing all fields', article: { title: '', description: '', body: '' }, expectedError:  errorMessages.emptyTitle },
      ];

      for (const testCase of testCases) {
        test(`Should NOT create article when ${testCase.name}`, async () => {
          await articlePage.publishArticle(testCase.article);
    
          await expect(basePage.errorMessage).toBeVisible();
          await expect(basePage.errorMessage).toContainText(testCase.expectedError);
        });
      }
})