import { getNewPasswordLink, getTimeToExpirationString } from "./utils.js";

const createRegisterEmail = (
  name: string,
  email: string,
  activationKey: string,
  activationKeyExpiry: number
) => {
  const timeToExpirationString = getTimeToExpirationString(activationKeyExpiry);

  const newPasswordLink = getNewPasswordLink(activationKey, email);

  return {
    subject: `Welcome to Coders One, ${name}. Please activate your account`,
    text: `Hello ${name},\n\nWelcome to Coders App.\n\nYou need to set a password to activate your account.\n\nPlease visit this page to set your password: ${newPasswordLink}\n\nThis link expires in ${timeToExpirationString}.`,
  };
};

export default createRegisterEmail;
