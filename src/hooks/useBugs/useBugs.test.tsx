import { renderHook } from "@testing-library/react";
import useBugs from "./useBugs";
import { Provider } from "react-redux";
import { store } from "../../store";
import { Bugs } from "../../types";
import { mocksBugs } from "../../factories/bugsFactory";

describe("Given a useBugs custom hook", () => {
  describe("When it's function getBugs it's invoked", () => {
    test("Then it should return a list of two bugs ", async () => {
      const {
        result: {
          current: { getBugs },
        },
      } = renderHook(() => useBugs(), {
        wrapper({ children }) {
          return <Provider store={store}>{children}</Provider>;
        },
      });

      const bugs: Bugs = await getBugs();

      expect(bugs).toStrictEqual(mocksBugs);
    });
  });
});
