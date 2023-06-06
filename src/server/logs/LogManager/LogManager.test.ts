import fsSync from "fs";
import path from "path";
import LogManager from "./LogManager";

describe("Given an instance of LogManager", () => {
  const fakeLog = "log";
  const fileName = "fakeFileName";
  const folderName = "fakeFolderName";
  const fakePath = path.join(folderName, fileName);

  afterEach(() => {
    jest.restoreAllMocks();
    fsSync.rmSync(folderName, { recursive: true, force: true });
  });

  describe("When the method writeLogToFile it's invoked with 'log'", () => {
    test("Then it should be 'log' write into 'fakeFolderName/fakeFileName' path", async () => {
      const logManager = new LogManager(fileName, folderName);

      await logManager.writeLogToFile(fakeLog);
      const log = fsSync.readFileSync(fakePath, { encoding: "utf8" });

      expect(log).toBe(fakeLog);
    });
  });

  describe("When the method readLogFromFile it's invoked with 'fakeFolderName/fakeFileName'", () => {
    beforeAll(() => {
      fsSync.mkdirSync(folderName, { recursive: true });
      fsSync.appendFileSync(fakePath, fakeLog);
    });

    test("Then the method readLogFromFile should return the log inside the given path with 'log'", async () => {
      const logManager = new LogManager(fileName, folderName);

      const logData = await logManager.readLogFromFile(fakePath);

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
      const logManager = new LogManager(fileName, folderName);

      const pathByDate = logManager.generatePathByDate(fakeDate);

      expectedPartialPaths.forEach((partialPath) => {
        expect(pathByDate).toContain(partialPath);
      });
    });
  });
});
