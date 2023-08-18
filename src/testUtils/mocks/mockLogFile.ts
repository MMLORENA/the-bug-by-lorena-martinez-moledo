import type { LogFile } from "../../server/logs/types";

const getMockLogFile = (logName?: string): LogFile => ({
  name: logName ?? "01011970",
  details: "log",
});

export default getMockLogFile;
