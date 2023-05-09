export enum LoginAttemptStatus {
  unauthorized,
  logged,
  unknown,
}

export interface LogData {
  email: string;
  time: Date;
  status: LoginAttemptStatus;
}
