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

  public generatePathByDate(date: Date): string {
    const dateMaxLength = 2;
    const dateFormatFill = "0";

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1)
      .toString()
      .padStart(dateMaxLength, dateFormatFill);
    const day = date
      .getDate()
      .toString()
      .padStart(dateMaxLength, dateFormatFill);

    return path.join(this.folderName, year, month, `${day}${month}${year}`);
  }

  public async readLogFromFile(path: string): Promise<string> {
    return fs.readFile(path, { encoding: "utf8" });
  }

  private async manageFilePath(): Promise<void> {
    const isFile = fsSync.existsSync(this.filePath);

    if (!isFile) {
      await fs.mkdir(this.folderName, { recursive: true });
    }
  }
}

export default LogManager;
