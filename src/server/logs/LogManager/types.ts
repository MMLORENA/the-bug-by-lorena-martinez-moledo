interface LogManagerStructure {
  writeLogToFile: (log: string) => Promise<void>;
  generatePathByDate: (date: Date) => string;
  readLogFromFile: (path: string) => Promise<string>;
}

export default LogManagerStructure;
