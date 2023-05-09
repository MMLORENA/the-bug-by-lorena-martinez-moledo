import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes.js";
import type { LogData } from "../types.js";
import { LoginAttemptStatus } from "../types.js";

const {
  successCodes: { okCode },
} = httpStatusCodes;

class Log implements LogData {
  time: Date;
  status: LoginAttemptStatus;

  constructor(public email: string, responseStatusCode: number) {
    this.setTime();
    this.checkLogAttemptStatus(responseStatusCode);
  }

  private setTime(): void {
    this.time = new Date();
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
