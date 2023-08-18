import type { DateParts } from "./getDateParts";
import getDateParts from "./getDateParts";

describe("Given an getDateParts function", () => {
  const fakeDate = new Date("1970-01-01");

  describe("When it's invoked with '1970-01-01'", () => {
    test("Then it should return an object with day: '01', month: '01', year: '1970'", () => {
      const expectedSliceDate: DateParts = {
        day: "01",
        month: "01",
        year: "1970",
      };

      const sliceDate = getDateParts(fakeDate);

      expect(sliceDate).toHaveProperty("day", expectedSliceDate.day);
      expect(sliceDate).toHaveProperty("month", expectedSliceDate.month);
      expect(sliceDate).toHaveProperty("year", expectedSliceDate.year);
    });
  });
});
