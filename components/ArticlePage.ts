import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';


export interface ArticleFields {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
}

export class ArticlePage extends BasePage {
    artilceTitle: Locator;
    articleDescription: Locator;
    articleBody: Locator;
    articleTag: Locator;
    articleButton: Locator;
    articleContentBlock: Locator;
    tagList: Locator;

    constructor(page: Page) {
        super(page);
        this.artilceTitle = page.getByPlaceholder('Article Title');
        this.articleDescription = page.getByPlaceholder('What\'s this article about?');
        this.articleBody = page.getByPlaceholder('Write your article (in markdown)');
        this.articleTag = page.getByPlaceholder('Enter tags');
        this.articleButton = page.getByRole('button', { name: 'Publish Article' });

        this.articleContentBlock = page.locator('.article-content');
        this.tagList = this.articleContentBlock.locator('.tag-default');
    }

    async goTo() {
        await this.page.goto('/editor');
    }

    async publishArticle(article: ArticleFields) {
        await this.artilceTitle.fill(article.title);
        await this.articleDescription.fill(article.description);
        await this.articleBody.fill(article.body);

        if(article.tagList) {
            for (const tag of article.tagList) {
                await this.articleTag.pressSequentially(tag);
                await this.page.keyboard.press('Enter');
            }          
        }

        await this.articleButton.click();
        if(await this.artilceTitle.inputValue() !== '' && await this.articleBody.inputValue() !== '' && await this.articleDescription.inputValue() !== '') {
            await this.page.waitForResponse('**/api/articles**');
        }
    }
}