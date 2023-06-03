import { getNewPasswordLink, getTimeToExpirationString } from "./utils.js";

const createForgottenPasswordEmail = (
  name: string,
  activationKey: string,
  activationKeyExpiry: number
) => {
  const timeToExpirationString = getTimeToExpirationString(activationKeyExpiry);

  const newPasswordLink = getNewPasswordLink(activationKey);

  return {
    subject: `${name}, please set your new password`,
    text: `Hello ${name},\n\nWe've received a request to set a new password.\n\nPlease click the following link to set the password: ${newPasswordLink}\n\nThis link expires in ${timeToExpirationString}.`,
  };
};

export default createForgottenPasswordEmail;
