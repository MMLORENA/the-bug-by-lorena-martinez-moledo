import { getMockBug, getMockBugs } from "../../factories/bugsFactory";
import { bugzillaName, notFoundSpiderName } from "../../mocks/bugs/bugs";
import { Bugs } from "../../types";
import {
  bugsReducer,
  createBugActionCreator,
  deleteBugActionCreator,
  initialBugsState,
  loadBugsActionCreator,
} from "./bugsSlice";
import { BugsState } from "./types";

describe("Given a bugsReducer function", () => {
  const mockBugZilla = getMockBug({ name: bugzillaName });
  const mockNotFoundSpider = getMockBug({ name: notFoundSpiderName });
  const mockBugsList = getMockBugs(2);

  describe("When it receives current bugs state and loadBugs action with 'Bugzilla' and '404 Spider'", () => {
    test("Then it should return a new state with the received bugs data", () => {
      const currentState: BugsState = initialBugsState;
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
        bugs: [...mockBugsList, mockBugToDelete],
      };

      const deleteBugAction = deleteBugActionCreator(idToDelete);

      const newBugsState = bugsReducer(currentState, deleteBugAction);

      expect(newBugsState).not.toContain(mockBugToDelete);
    });
  });

  describe("When it receives a current bugs state and createBug action with bug data with name 'Bugzilla' ", () => {
    test("Then it should return a new state added the received bug data", () => {
      const currentBugsState: BugsState = {
        bugs: mockBugsList,
      };

      const createBug = createBugActionCreator(mockBugZilla);
      const newBugsState = bugsReducer(currentBugsState, createBug);

      expect(newBugsState).toHaveProperty("bugs", [
        ...currentBugsState.bugs,
        mockBugZilla,
      ]);
    });
  });
});
