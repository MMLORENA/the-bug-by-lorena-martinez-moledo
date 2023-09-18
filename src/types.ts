export interface Bug {
  id: string;
  name: string;
  description: string;
  category: string;
  picture: string;
}

export type Bugs = Bug[];
export type BugData = Omit<Bug, "id">;
