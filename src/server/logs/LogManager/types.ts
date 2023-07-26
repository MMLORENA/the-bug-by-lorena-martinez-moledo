interface LogManagerStructure {
  writeLogToFile: (log: string) => void;
  generatePathByDate: (date: Date) => string;
  readLogFromFile: (path: string) => string;
  getFilenamesFromLastNumberOfDays: (lastDaysNumber: number) => string[];
}

export default LogManagerStructure;
