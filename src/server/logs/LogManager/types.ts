interface LogManagerStructure {
  writeLogToFile: (log: string) => void;
  generatePathByDate: (date: Date) => string;
  readLogFromFile: (path: string) => string;
}

export default LogManagerStructure;
