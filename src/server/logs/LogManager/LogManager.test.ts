import fsSync from "fs";
import path from "path";
import LogManager from "./LogManager";
import getDateParts from "./getDateParts/getDateParts";

describe("Given an instance of LogManager", () => {
  const fakeLog = "log";
  const date = new Date();
  const { day, month, year } = getDateParts(date);
  const folderName = "fakeFolderName";
  const foldersFakePath = path.join(folderName, year, month);
  const fakePathWithFile = path.join(
    folderName,
    year,
    month,
    `${day}${month}${year}`
  );

  afterEach(() => {
    fsSync.rmSync(folderName, { recursive: true, force: true });
  });

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
    const fakeDate = new Date("1970-01-01T00:00:00.000");

    beforeAll(() => {
      jest.useFakeTimers();
    });

    beforeEach(() => {
      jest.setSystemTime(fakeDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

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
});
