import { getLastDays } from "./getLastDays";

describe("Given a getLastDays function", () => {
  describe("When it receives 2 as last number of days", () => {
    test("Then it should return a list of two dates", () => {
      const lastDaysNumber = 2;
      const expectedNumberOfDays = 2;

      const lastTwoDays = getLastDays(lastDaysNumber);

      expect(lastTwoDays).toHaveLength(expectedNumberOfDays);
    });
  });
});
