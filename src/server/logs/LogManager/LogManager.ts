import fs from "fs";
import path from "path";
import type { DateParts } from "./getDateParts/getDateParts.js";
import getDateParts from "./getDateParts/getDateParts.js";
import type LogManagerStructure from "./types";
import { getLastNDays } from "../datesUtils/getLastNDays/getLastNDays.js";

class LogManager implements LogManagerStructure {
  private readonly filePath: string;

  constructor(private readonly folderRootName: string) {
    this.filePath = this.generatePathByDate(new Date());

    this.managePath();
  }

  public writeLogToFile(log: string): void {
    fs.appendFileSync(this.filePath, log);
  }

  public generatePathByDate(date: Date): string {
    const { day, month, year }: DateParts = getDateParts(date);

    return path.join(this.folderRootName, year, month, `${day}${month}${year}`);
  }

  public readLogFromFile(path: string): string {
    return fs.readFileSync(path, { encoding: "utf8" });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public getFilenamesFromLastNDays(lastNDays: number): string[] {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const lastNDaysList: Date[] = getLastNDays(lastNDays);

    const filenames: string[] = [];

    for (const date of lastNDaysList) {
      const { year, day, month } = getDateParts(date);
      const filename = `${day}${month}${year}`;
      const pathDate = path.join(this.folderRootName, year, month, filename);

      const existsFile = fs.existsSync(pathDate);

      if (existsFile) {
        filenames.push(filename);
      }
    }

    return filenames;
  }

  private managePath(): void {
    const paths = this.filePath.split(path.sep);

    let directoryPath = "";

    paths.forEach((currentPath) => {
      const existsPath = fs.existsSync(currentPath);

      if (!existsPath) {
        const directoryToCreate =
          directoryPath === "" ? currentPath : directoryPath;

        fs.mkdirSync(directoryToCreate, { recursive: true });
      }

      directoryPath = path.join(directoryPath, currentPath);
    });
  }
}

export default LogManager;
