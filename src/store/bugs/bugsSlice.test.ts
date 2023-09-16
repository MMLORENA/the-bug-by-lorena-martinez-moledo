import { Bugs } from "../../types";
import { bugsReducer, loadBugsActionCreator } from "./bugsSlice";
import { BugsState } from "./types";

describe("Given a bugsReducer function", () => {
  describe("When it receives current bugs state and loadBugs action with 'Bugzilla' and '404 Spider'", () => {
    test("Then it should return a new state with the received bugs data", () => {
      const currentState: BugsState = {
        bugs: [],
      };
      const mockBugs: Bugs = [
        {
          id: "",
          name: "Bugzilla",
          category: "",
          description: "",
          picture: "",
        },
        {
          id: "",
          name: "404 Spider",
          category: "",
          description: "",
          picture: "",
        },
      ];

      const loadBugsAction = loadBugsActionCreator(mockBugs);

      const newBugsState = bugsReducer(currentState, loadBugsAction);

      expect(newBugsState).toHaveProperty("bugs", mockBugs);
    });
  });
});
