import { faker } from "@faker-js/faker";
import { ArticleFields } from "../components/ArticlePage";

export function generateArticleData(tagCount: number): ArticleFields {
    return {
      title: faker.lorem.words(5),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(2),
      tagList: Array.from({ length: tagCount }, () => faker.lorem.word(3)),
    };
  }