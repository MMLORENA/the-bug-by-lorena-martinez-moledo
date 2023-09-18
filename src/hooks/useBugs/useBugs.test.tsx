import { renderHook } from "@testing-library/react";
import useBugs from "./useBugs";
import { Provider } from "react-redux";
import { store } from "../../store";
import { Bug, Bugs } from "../../types";
import { mocksBugs } from "../../factories/bugsFactory";
import { errorsHandlers } from "../../mocks/handlers";
import server from "../../mocks/server";
import { mockBugzillaData } from "../../mocks/bugs/bugs";

describe("Given a useBugs custom hook", () => {
  const {
    result: {
      current: { getBugs, deleteBug, createBug },
    },
  } = renderHook(() => useBugs(), {
    wrapper({ children }) {
      return <Provider store={store}>{children}</Provider>;
    },
  });

  describe("When it's function getBugs it's invoked", () => {
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

  const bugToDelete = "1";

  describe("When its function deleteBug it's invoked with '1' and the bug is correctly deleted", () => {
    test("Then it should not to throw an error", async () => {
      await expect(deleteBug(bugToDelete)).resolves.not.toThrow();
    });
  });

  describe("When its function deleteBug it's invoked with '1' and there is an error", () => {
    test("Then it should not to throw an error", async () => {
      server.use(...errorsHandlers);

      await expect(deleteBug(bugToDelete)).rejects.toThrowError();
    });
  });

  describe("When it's function createBug it's invoked with 'Bugzilla' data without id", () => {
    test("Then it should return 'Bugzilla' bug with id '1'", async () => {
      const newBug: Bug = await createBug(mockBugzillaData);

      expect(newBug).toStrictEqual({ ...mockBugzillaData, id: "1" });
    });

    describe("And there is an error", () => {
      test("Then it should throw an error", async () => {
        server.use(...errorsHandlers);

        await expect(createBug({} as Bug)).rejects.toThrowError();
      });
    });
  });
});
