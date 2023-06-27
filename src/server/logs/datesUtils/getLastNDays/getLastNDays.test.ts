import getLastNDays from "./getLastNDays";

describe("Given a getLastNDays function", () => {
  describe("When it receives 2 as last number of days", () => {
    test("Then it should return a list of two dates", () => {
      const lastNumberDays = 2;
      const expectedNumberOfDays = 2;

      const lastTwoDays = getLastNDays(lastNumberDays);

      expect(lastTwoDays).toHaveLength(expectedNumberOfDays);
    });
  });
});
