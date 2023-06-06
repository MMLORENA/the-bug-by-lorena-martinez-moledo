interface LogManagerStructure {
  writeLogToFile: (log: string) => Promise<void>;
  generatePathByDate: (date: Date) => string;
}

export default LogManagerStructure;
