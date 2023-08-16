import CustomError from "../../../CustomError/CustomError";
import httpStatusCodes from "../../statusCodes/httpStatusCodes";
import authErrors from "../authErrors";

const {
  clientErrors: { unauthorizedCode },
} = httpStatusCodes;

describe("Given a generalAuthError method", () => {
  describe("When it is called without message", () => {
    test("Then it should return a new custom Error with 'Unauthorized' message", () => {
      const unauthorizedMessage = "Unauthorized";
      const expectedError = new CustomError(
        unauthorizedMessage,
        unauthorizedCode,
        unauthorizedMessage
      );

      const errorWithoutMessage = authErrors.generalAuthError();

      expect(errorWithoutMessage).toStrictEqual(expectedError);
    });
  });
});
