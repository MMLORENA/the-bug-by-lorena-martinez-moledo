import { environment } from "../../environment/loadEnvironments.js";

export const getNewPasswordLink = (activationKey: string) =>
  `${environment.authFrontUrl}/set-password?key=${activationKey}`;

export const getTimeToExpirationString = (activationKeyExpiry: number) => {
  const timeToExpirationInHours = activationKeyExpiry / 1000 / 60 / 60;
  const timeToExpirationInDays = timeToExpirationInHours / 24;

  const timeToExpiration =
    timeToExpirationInHours > 24
      ? `${Math.trunc(timeToExpirationInDays)} day${
          timeToExpirationInDays >= 2 ? "s" : ""
        }`
      : `${timeToExpirationInHours} hour${
          timeToExpirationInHours >= 2 ? "s" : ""
        }`;

  return timeToExpiration;
};
