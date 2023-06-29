interface LogManagerStructure {
  writeLogToFile: (log: string) => void;
  generatePathByDate: (date: Date) => string;
  readLogFromFile: (path: string) => string;
  getNameFilesFromLastNDays: (lastNDays: number) => string[];
}

export default LogManagerStructure;
