interface LogManagerStructure {
  writeLogToFile: (log: string) => Promise<void>;
  readLogFromFile: (path: string) => Promise<string>;
}

export default LogManagerStructure;
