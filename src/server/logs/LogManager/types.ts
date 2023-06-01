interface LogManagerStructure {
  writeLogToFile: (log: string) => Promise<void>;
  readLogToFile: (path: string) => Promise<string>;
}

export default LogManagerStructure;
