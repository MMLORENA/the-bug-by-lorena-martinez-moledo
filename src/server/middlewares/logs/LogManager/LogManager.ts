import fsSync from "fs";
import fs from "fs/promises";
import path from "path";
import type LogManagerStructure from "./types";

class LogManager implements LogManagerStructure {
  private readonly filePath: string;

  constructor(fileName: string, private readonly folderName: string) {
    this.filePath = path.join(folderName, fileName);
  }

  public async writeLogToFile(log: string): Promise<void> {
    await this.manageFilePath();
    await fs.appendFile(this.filePath, log);
  }

  private async manageFilePath(): Promise<void> {
    const isFile = fsSync.existsSync(this.filePath);

    if (!isFile) {
      await fs.mkdir(this.folderName, { recursive: true });
    }
  }
}

export default LogManager;
