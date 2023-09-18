import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { Bug } from "../types";
import { bugzillaName, notFoundSpiderName } from "../mocks/bugs/bugs";

const bugFactory = Factory.define<Bug>(() => ({
  id: faker.string.uuid(),
  category: faker.lorem.word(),
  description: faker.lorem.sentence(),
  picture: faker.image.url(),
  name: faker.lorem.words(2),
}));

export const getMockBug = (bug?: Partial<Bug>) => bugFactory.build(bug);
export const getMockBugs = (numberOfBugs = 2) =>
  bugFactory.buildList(numberOfBugs);

export const mocksBugs = getMockBugs(2);
export const mockBugZilla = getMockBug({ name: bugzillaName });
export const mockNotFoundSpider = getMockBug({ name: notFoundSpiderName });
