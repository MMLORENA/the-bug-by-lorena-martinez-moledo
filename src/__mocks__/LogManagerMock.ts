import type LogManagerStructure from "../server/logs/LogManager/types";

class LogManagerMock implements LogManagerStructure {
  constructor(private readonly fakeRootFolderName: string) {}

  getFilenamesFromLastNumberOfDays(_lastDaysNumber: number): string[] {
    return ["01011970"];
  }

  writeLogToFile(_log: string): void {}

  generatePathByDate(_date: Date) {
    return `${this.fakeRootFolderName}/1970/01/01011970`;
  }

  readLogFromFile(_path: string): string {
    return "log";
  }
}

export default LogManagerMock;
