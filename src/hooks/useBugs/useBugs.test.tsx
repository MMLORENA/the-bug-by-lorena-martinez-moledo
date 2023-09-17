import { renderHook } from "@testing-library/react";
import useBugs from "./useBugs";
import { Provider } from "react-redux";
import { store } from "../../store";
import { Bugs } from "../../types";
import { mocksBugs } from "../../factories/bugsFactory";
import { errorsHandlers } from "../../mocks/handlers";
import server from "../../mocks/server";

describe("Given a useBugs custom hook", () => {
  describe("When it's function getBugs it's invoked", () => {
    const {
      result: {
        current: { getBugs },
      },
    } = renderHook(() => useBugs(), {
      wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>;
      },
    });

    test("Then it should return a list of two bugs ", async () => {
      const bugs: Bugs = await getBugs();

      expect(bugs).toStrictEqual(mocksBugs);
    });

    describe("And there is an error", () => {
      test("Then it should throw an error", async () => {
        server.use(...errorsHandlers);

        await expect(getBugs()).rejects.toThrowError();
      });
    });
  });
});
