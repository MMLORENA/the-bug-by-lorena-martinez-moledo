interface LogManagerStructure {
  writeLogToFile: (log: string) => Promise<void>;
  generatePathByDate: (date: string) => string;
}

export default LogManagerStructure;
