import { luisName } from "../../testUtils/mocks/mockUsers";
import createForgottenPasswordEmail from "./createForgottenPasswordEmail";
import { getNewPasswordLink } from "./utils";

describe("Given the function createForgottenPasswordEmail", () => {
  describe("When it receives name 'Luis', activation key 'test-activation-key' and key expiration tomorrow", () => {
    const activationKey = "test-activation-key";
    const activationKeyExpiry = new Date().setDate(new Date().getDate() + 1);

    test("Then it should return a subject: 'Luis, please set your new password' and text with an activation link", () => {
      const expectedEmailSubject = "Luis, please set your new password";

      const forgottenPasswordEmail = createForgottenPasswordEmail(
        luisName,
        activationKey,
        activationKeyExpiry
      );

      expect(forgottenPasswordEmail).toHaveProperty(
        "subject",
        expectedEmailSubject
      );
    });

    test("Then it should return a text containing 'Hello Luis'", () => {
      const expectedEmailGreeting = "Hello Luis";

      const forgottenPasswordEmail = createForgottenPasswordEmail(
        luisName,
        activationKey,
        activationKeyExpiry
      );

      expect(forgottenPasswordEmail.text).toContain(expectedEmailGreeting);
    });

    test("Then it should return a text with an activation link", () => {
      const expectedEmailActivationLink = getNewPasswordLink(activationKey);

      const forgottenPasswordEmail = createForgottenPasswordEmail(
        luisName,
        activationKey,
        activationKeyExpiry
      );

      expect(forgottenPasswordEmail.text).toContain(
        expectedEmailActivationLink
      );
    });
  });
});
