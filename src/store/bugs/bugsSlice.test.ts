import { getMockBug } from "../../factories/bugsFactory";
import { bugzillaName, notFoundSpiderName } from "../../mocks/bugs/bugs";
import { Bugs } from "../../types";
import {
  bugsReducer,
  initialBugsState,
  loadBugsActionCreator,
} from "./bugsSlice";
import { BugsState } from "./types";

describe("Given a bugsReducer function", () => {
  describe("When it receives current bugs state and loadBugs action with 'Bugzilla' and '404 Spider'", () => {
    test("Then it should return a new state with the received bugs data", () => {
      const currentState: BugsState = initialBugsState;
      const mockBugZilla = getMockBug({ name: bugzillaName });
      const mockNotFoundSpider = getMockBug({ name: notFoundSpiderName });
      const mockBugs: Bugs = [mockBugZilla, mockNotFoundSpider];

      const loadBugsAction = loadBugsActionCreator(mockBugs);

      const newBugsState = bugsReducer(currentState, loadBugsAction);

      expect(newBugsState).toHaveProperty("bugs", mockBugs);
    });
  });
});
