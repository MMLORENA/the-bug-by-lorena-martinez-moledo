import type LogManagerStructure from "../server/logs/LogManager/types";

class LogManagerMock implements LogManagerStructure {
  constructor(private readonly fakeRootFolderName: string) {}
  // eslint-disable-next-line @typescript-eslint/naming-convention
  getFilenamesFromLastNDays(_lastNDays: number): string[] {
    return ["01011970"];
  }

  writeLogToFile(_log: string): void {}

  generatePathByDate(_date: Date) {
    return this.fakeRootFolderName;
  }

  readLogFromFile(_path: string): string {
    return "log";
  }
}

export default LogManagerMock;
