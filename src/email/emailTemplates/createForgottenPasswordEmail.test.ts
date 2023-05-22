import { luisName } from "../../testUtils/mocks/mockUsers";
import createForgottenPasswordEmail from "./createForgottenPasswordEmail";

describe("Given the function createForgottenPasswordEmail", () => {
  describe("When it receives name 'Luis' and activation key 'test-activation-key'", () => {
    test("Then it should return a subject: 'Luis, set your new password' and text with an activation link", () => {
      const activationKey = "test-activation-key";
      const expectedEmailText = `Hello Luis,\n\nWe've received a request to set a new password.\n\nPlease click the following link to set the password: test-activation-key\n\nThis link expires in 24 hours.`;
      const expectedEmailSubject = "Luis, set your new password";
      const expectedEmail = {
        text: expectedEmailText,
        subject: expectedEmailSubject,
      };

      const forgottenPasswordEmail = createForgottenPasswordEmail(
        luisName,
        activationKey
      );

      expect(forgottenPasswordEmail).toStrictEqual(expectedEmail);
    });
  });
});
