import fsSync from "fs";
import fs from "fs/promises";
import path from "path";
import type LogManagerStructure from "./types";

class LogManager implements LogManagerStructure {
  private readonly filePath: string;

  constructor(fileName: string, private readonly folderName: string) {
    this.filePath = path.join(folderName, fileName);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.manageFilePath();
  }

  public async writeLogToFile(log: string): Promise<void> {
    await fs.appendFile(this.filePath, log);
  }

  public generatePathByDate(date: string): string {
    const month = date.slice(2, 4);
    const year = date.slice(4);

    return path.join(this.folderName, year, month, date);
  }

  private async manageFilePath(): Promise<void> {
    const isFile = fsSync.existsSync(this.filePath);

    if (!isFile) {
      await fs.mkdir(this.folderName, { recursive: true });
    }
  }
}

export default LogManager;
