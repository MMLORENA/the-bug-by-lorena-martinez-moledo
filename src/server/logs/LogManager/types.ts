interface LogManagerStructure {
  writeLogToFile: (log: string) => Promise<void>;
}

export default LogManagerStructure;
