export enum BugCategory {
  logicalBugs = "Logical Bugs",
  syntaxErrors = "Syntax Errors",
  uIuXProblems = "UI/UX Problems",
  performanceIssues = "Performance Issues",
  securityVulnerabilities = "Security Vulnerabilities",
}

export interface Bug {
  id: string;
  name: string;
  description: string;
  category: BugCategory;
  picture: string;
}

export type Bugs = Bug[];
