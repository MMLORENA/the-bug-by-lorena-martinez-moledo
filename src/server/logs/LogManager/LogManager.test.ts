import fsSync from "fs";
import path from "path";
import LogManager from "./LogManager";
import getDateParts from "./getDateParts/getDateParts";

describe("Given an instance of LogManager", () => {
  const fakeDate = new Date("1970-01-01T00:00:00.000");

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.setSystemTime(fakeDate);
  });

  afterEach(() => {
    fsSync.rmSync(folderName, { recursive: true, force: true });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const fakeLog = "log";
  const { day, month, year } = getDateParts(fakeDate);
  const folderName = "fakeFolderName";
  const foldersFakePath = path.join(folderName, year, month);
  const fakePathWithFile = path.join(
    folderName,
    year,
    month,
    `${day}${month}${year}`
  );

  describe("When the method writeLogToFile it's invoked with 'log'", () => {
    test("Then it should be 'log' write into 'fakeFolderName' path", () => {
      const logManager = new LogManager(folderName);

      logManager.writeLogToFile(fakeLog);
      const log = fsSync.readFileSync(fakePathWithFile, { encoding: "utf8" });

      expect(log).toBe(fakeLog);
    });
  });

  describe("When the method readLogFromFile it's invoked with a path", () => {
    beforeAll(() => {
      fsSync.mkdirSync(foldersFakePath, { recursive: true });
      fsSync.appendFileSync(fakePathWithFile, fakeLog);
    });

    test("Then the method readLogFromFile should return the log inside the given path with 'log'", () => {
      const logManager = new LogManager(folderName);

      const logData = logManager.readLogFromFile(fakePathWithFile);

      expect(logData).toBe(fakeLog);
    });
  });

  describe("When the method generatePathByDate it's invoked with date '1970-01-01T00:00:00.000Z' ", () => {
    test("Then it should return a path with 'fakeFolderName', '1970','01' and '01011970'", () => {
      const expectedDate = "01011970";
      const expectedYear = "1970";
      const expectedMonth = "01";
      const expectedPartialPaths = [
        folderName,
        expectedDate,
        expectedYear,
        expectedMonth,
      ];
      const logManager = new LogManager(folderName);

      const pathByDate = logManager.generatePathByDate(fakeDate);

      expectedPartialPaths.forEach((partialPath) => {
        expect(pathByDate).toContain(partialPath);
      });
    });
  });

  describe("When the method getFilenamesFromLastNDays it's invoked with 2", () => {
    const logManager = new LogManager(folderName);
    const lastTwoDays = 2;

    describe("And exist a file with name '01011970'", () => {
      beforeEach(() => {
        fsSync.mkdirSync(foldersFakePath, { recursive: true });
        fsSync.appendFileSync(fakePathWithFile, fakeLog);
      });

      test("Then it should return a list with '01011970' ", () => {
        const expectedNameFromLastTwoDays = ["01011970"];

        const filenames = logManager.getFilenamesFromLastNDays(lastTwoDays);

        expect(filenames).toStrictEqual(expectedNameFromLastTwoDays);
      });
    });

    describe("And doesn't exist any file", () => {
      test("Then it should return an empty list", () => {
        const expectedNameFromLastTwoDays: string[] = [];

        const filenames = logManager.getFilenamesFromLastNDays(lastTwoDays);

        expect(filenames).toStrictEqual(expectedNameFromLastTwoDays);
      });
    });
  });
});
