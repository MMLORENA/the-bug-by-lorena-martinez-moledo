import type LogManagerStructure from "../server/logs/LogManager/types";

class LogManagerMock implements LogManagerStructure {
  constructor(private readonly fakeRootFolderName: string) {}

  writeLogToFile(_log: string): void {}

  generatePathByDate(_date: Date) {
    return this.fakeRootFolderName;
  }

  readLogFromFile(_path: string): string {
    return "log";
  }
}

export default LogManagerMock;
