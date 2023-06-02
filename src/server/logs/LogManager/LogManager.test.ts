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
      const restultLog = fsSync.readFileSync(fakePath, { encoding: "utf8" });

      expect(restultLog).toBe(fakeLog);
    });
  });

  describe("When the method readLogFromFile it's invoked with 'fakeFolderName/fakeFileName'", () => {
    beforeAll(() => {
      fsSync.mkdirSync(folderName, { recursive: true });
      fsSync.appendFileSync(fakePath, fakeLog);
    });

    test("Then the method readLogFromFile should return the log inside the given path with 'log'", async () => {
      const logManager = new LogManager(fileName, folderName);

      const resultLogData = await logManager.readLogFromFile(fakePath);

      expect(resultLogData).toBe(fakeLog);
    });
  });
});
