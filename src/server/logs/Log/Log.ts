import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import type { DateLocaleFormat, LogData } from "../types.js";
import { LoginAttemptStatus } from "../types.js";

const {
  successCodes: { okCode },
} = httpStatusCodes;

class Log implements LogData {
  time: Date;
  status: LoginAttemptStatus;

  constructor(
    private readonly email: string,
    responseStatusCode: number,
    private readonly dateLocaleFormat?: DateLocaleFormat
  ) {
    this.setTime();
    this.checkLogAttemptStatus(responseStatusCode);
  }

  public createLog(): string {
    return `[${this.dateToString()}] User: ${this.email}, status: ${
      LoginAttemptStatus[this.status]
    };\n`;
  }

  private setTime(): void {
    this.time = new Date();
  }

  private dateToString(): string {
    return this.time.toLocaleString(
      this.dateLocaleFormat?.locales,
      this.dateLocaleFormat?.options
    );
  }

  private checkLogAttemptStatus(responseStatusCode: number): void {
    if (responseStatusCode !== okCode) {
      this.status = LoginAttemptStatus.unauthorized;
      return;
    }

    this.status = LoginAttemptStatus.logged;
  }
}

export default Log;
