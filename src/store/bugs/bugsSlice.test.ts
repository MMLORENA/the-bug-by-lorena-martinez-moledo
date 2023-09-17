import { getMockBug, getMockBugs } from "../../factories/bugsFactory";
import { bugzillaName, notFoundSpiderName } from "../../mocks/bugs/bugs";
import { Bugs } from "../../types";
import {
  bugsReducer,
  deleteBugActionCreator,
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

  describe("When it receives a current bugs state and deleteBug action with '1'", () => {
    test("Then it should return a new bugs state without the bug with the received id '1'", () => {
      const idToDelete = "1";
      const mockBugToDelete = getMockBug({ id: idToDelete });
      const currentState: BugsState = {
        bugs: [...getMockBugs(2), mockBugToDelete],
      };

      const deleteBugAction = deleteBugActionCreator(idToDelete);

      const newBugsState = bugsReducer(currentState, deleteBugAction);

      expect(newBugsState).not.toContain(mockBugToDelete);
    });
  });
});
