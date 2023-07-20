interface LogManagerStructure {
  writeLogToFile: (log: string) => void;
  generatePathByDate: (date: Date) => string;
  readLogFromFile: (path: string) => string;
  getFilenamesFromLastNDays: (lastNDays: number) => string[];
}

export default LogManagerStructure;
