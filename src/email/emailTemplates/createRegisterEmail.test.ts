import { luisEmail, luisName } from "../../testUtils/mocks/mockUsers";
import createRegisterEmail from "./createRegisterEmail";
import { getNewPasswordLink } from "./utils";

describe("Given the function createRegisterEmail", () => {
  describe("When it receives name 'Luis', activation key 'test-activation-key' and key expiration tomorrow", () => {
    const activationKey = "test-activation-key";
    const activationKeyExpiry = new Date().setDate(new Date().getDate() + 1);

    test("Then it should return a subject: 'Welcome to Coders One, Luis. Please activate your account'", () => {
      const expectedEmailSubject =
        "Welcome to Coders One, Luis. Please activate your account";

      const registerEmail = createRegisterEmail(
        luisName,
        luisEmail,
        activationKey,
        activationKeyExpiry
      );

      expect(registerEmail).toHaveProperty("subject", expectedEmailSubject);
    });

    test("Then it should return a text containing 'Hello Luis'", () => {
      const expectedEmailGreeting = "Hello Luis";

      const registerEmail = createRegisterEmail(
        luisName,
        luisEmail,
        activationKey,
        activationKeyExpiry
      );

      expect(registerEmail.text).toContain(expectedEmailGreeting);
    });

    test("Then it should return a text containing an activation link", () => {
      const expectedEmailActivationLink = getNewPasswordLink(
        activationKey,
        luisEmail
      );

      const registerEmail = createRegisterEmail(
        luisName,
        luisEmail,
        activationKey,
        activationKeyExpiry
      );

      expect(registerEmail.text).toContain(expectedEmailActivationLink);
    });
  });
});
