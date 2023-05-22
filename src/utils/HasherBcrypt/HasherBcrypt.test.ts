import HasherBcrypt from "./HasherBcrypt";
import bcrypt from "bcryptjs";

describe("Given an instance of HasherBcrypt class", () => {
  const hasher = new HasherBcrypt();
  const password = "test-password";
  const hashedPassword = "test-hash";

  describe("When the method hash is invoked with 'test-password' as text", () => {
    test("Then it should return the password hashed", async () => {
      const salt = 10;
      jest.spyOn(bcrypt, "hash").mockImplementation(() => hashedPassword);

      const returnedHashedPassword = await hasher.hash(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
      expect(returnedHashedPassword).toBe(hashedPassword);
    });
  });

  describe("And when the method compare is invoked with 'test-password' as text and a valid hashed password", () => {
    test("Then it should return true", async () => {
      jest.spyOn(bcrypt, "compare").mockImplementation(() => true);

      const resultComparison = await hasher.compare(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(resultComparison).toBe(true);
    });
  });
});
