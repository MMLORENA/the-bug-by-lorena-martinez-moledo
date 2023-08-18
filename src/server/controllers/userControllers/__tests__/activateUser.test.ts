import type { Request } from "express";
import { type NextFunction, type Response } from "express";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import User from "../../../../database/models/User";
import { getMockUser } from "../../../../factories/userFactory";
import type { UserActivationCredentials, UserEmail } from "../../../types";
import { activateUser } from "../userControllers";

const {
  successCodes: { okCode },
} = httpStatusCodes;

const mockHash = jest.fn();
const mockCompare: jest.Mock<boolean | Promise<Error>> = jest.fn(() => true);

jest.mock("../../../../utils/HasherBcrypt/HasherBcrypt.js", () =>
  jest.fn().mockImplementation(() => ({
    hash: async () => (mockHash as jest.Mock<Promise<string>>)(),
    compare: () => mockCompare(),
  }))
);

jest.mock("../../../../email/sendEmail/sendEmail.js");

const user = getMockUser();

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given an activateUser function", () => {
  const req: Partial<
    Request<
      Record<string, unknown>,
      Record<string, unknown>,
      UserActivationCredentials,
      UserEmail
    >
  > = {
    query: { email: user.email },
    body: {
      password: user.password,
      confirmPassword: user.password,
    },
  };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  const email = "";
  const password = "";
  const nullUser = {
    ...user,
    email,
    password,
  };

  describe("When it receives a request with query string email, and body password and confirmPassword and the activationKey is valid", () => {
    test("Then it should invoke response's method status with 200 and json with the message 'User account has been activated'", async () => {
      User.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ user, save: jest.fn() }),
      });

      await activateUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserActivationCredentials,
          UserEmail
        >,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({
        message: "User account has been activated",
      });
    });
  });

  describe("When it receives a next function and the hash function fails with an error", () => {
    test("Then it shoul call the next function with the error", async () => {
      const expectedMessage = "Error on hashing password";
      const req: Partial<
        Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserActivationCredentials,
          UserEmail
        >
      > = {
        query: { email: nullUser.email },
        body: {
          password: nullUser.password,
          confirmPassword: nullUser.password,
        },
      };

      User.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ nullUser, save: jest.fn() }),
      });

      mockHash.mockRejectedValue(expectedMessage);

      await activateUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserActivationCredentials,
          UserEmail
        >,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
