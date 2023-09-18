import { BugCategory, BugData } from "../../types";

export const bugzillaName = "Bugzilla";
export const notFoundSpiderName = "404 Spider";
export const mockBugzillaData: BugData = {
  category: BugCategory.performanceIssues,
  description: "Bugzilla Bug",
  picture: "Bugzilla.jpg",
  name: bugzillaName,
};
