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
    test("Then it should be 'log' write into 'fakeFolderName\\fakeFileName' path", async () => {
      const logManager = new LogManager(fileName, folderName);

      await logManager.writeLogToFile(fakeLog);
      const resultLogData = await logManager.readLogToFile(fakePath);

      expect(resultLogData).toBe(fakeLog);
    });
  });

  describe("When the method readLogFromFile it's invoked with 'fakeFolderName\\fakeFileName'", () => {
    beforeAll(async () => {
      const logManagerFake = new LogManager(fileName, folderName);

      await logManagerFake.writeLogToFile(fakeLog);
    });

    test("Then the method readLogFromFile should return the log inside the given path with 'log'", async () => {
      const logManager = new LogManager(fileName, folderName);

      const resultLogData = await logManager.readLogToFile(fakePath);

      expect(resultLogData).toBe(fakeLog);
    });
  });
});
