export enum LoginAttemptStatus {
  unauthorized,
  logged,
  unknown,
}

export interface LogData {
  time: Date;
  status: LoginAttemptStatus;
  createLog: () => string;
}

export interface DateLocaleFormat {
  locales?: Intl.LocalesArgument;
  options?: Intl.DateTimeFormatOptions;
}
