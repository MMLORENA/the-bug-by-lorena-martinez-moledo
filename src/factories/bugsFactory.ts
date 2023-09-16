import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { Bug, BugCategory } from "../types";

const getRandomBugCategory = () => {
  const bugsCategories: BugCategory[] = Object.values(BugCategory);
  const randomBugCategoryPosition = Math.floor(
    Math.random() * bugsCategories.length
  );

  return bugsCategories[randomBugCategoryPosition];
};

const bugFactory = Factory.define<Bug>(() => ({
  id: faker.string.uuid(),
  category: getRandomBugCategory(),
  description: faker.lorem.sentence(),
  picture: faker.image.url(),
  name: faker.lorem.words(2),
}));

export const getMockBug = (bug?: Partial<Bug>) => bugFactory.build(bug);
export const getMockBugs = (numberOfBugs = 2) =>
  bugFactory.buildList(numberOfBugs);
