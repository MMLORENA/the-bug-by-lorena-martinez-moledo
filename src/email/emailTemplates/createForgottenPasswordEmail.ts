const createForgottenPasswordEmail = (name: string, activationKey: string) => ({
  subject: `${name}, please set your new password`,
  text: `Hello ${name},\n\nWe've received a request to set a new password.\n\nPlease click the following link to set the password: ${activationKey}\n\nThis link expires in 24 hours.`,
});

export default createForgottenPasswordEmail;
