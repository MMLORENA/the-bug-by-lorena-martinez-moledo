import fsSync from "fs";
import fs from "fs/promises";
import path from "path";
import LogManager from "./LogManager";

describe("Given an instance of LogManager", () => {
  const fileName = "fakeFileName";
  const folderName = "fakeFolderName";
  const fakePath = path.join(folderName, fileName);

  afterEach(() => {
    jest.restoreAllMocks();
    fsSync.rmSync(folderName, { recursive: true, force: true });
  });

  describe("When the method writeLogFile it's invoked with 'log'", () => {
    test("Then the method appendFile of fs should be invoked with 'fakeFolderName\\fakeFileName' as path and the log received", async () => {
      const spyAppendFile = jest.spyOn(fs, "appendFile");

      const log = "log";
      const writeLuisLogToFile = new LogManager(fileName, folderName);

      await writeLuisLogToFile.writeLogToFile(log);

      expect(spyAppendFile).toHaveBeenCalledWith(fakePath, log);
    });
  });
});
