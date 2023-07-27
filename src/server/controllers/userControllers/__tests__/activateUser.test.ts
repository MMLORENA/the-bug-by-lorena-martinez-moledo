import type { Response } from "express";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import User from "../../../../database/models/User";
import { activateUser } from "../userControllers";
import type { CustomRequest } from "../../../types";
import { luisEmail, luisPassword } from "../../../../testUtils/mocks/mockUsers";

const {
  successCodes: { okCode },
} = httpStatusCodes;

const mockHash: jest.Mock<Promise<string>> = jest.fn(async () => "");
const mockCompare: jest.Mock<Promise<boolean>> = jest.fn(async () => true);

jest.mock("../../../../utils/HasherBcrypt/HasherBcrypt.js", () =>
  jest.fn().mockImplementation(() => ({
    compare: async () => mockCompare(),
    hash: async () => mockHash(),
  }))
);

jest.mock("../../../../email/sendEmail/sendEmail.js");

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  User.findOne = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValueOnce({ luisEmail, save: jest.fn() }),
  });
});

describe("Given an activateUser function", () => {
  const req: Partial<CustomRequest> = {
    query: { luisEmail },
    body: {
      password: luisPassword,
      confirmPassword: luisPassword,
    },
  };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  describe("When it receives a request with query string email and body password and confirmPassword 'test-password' and the activationKey is valid", () => {
    test("Then it should invoke response's method status with 200 and json with the message 'User account has been activated'", async () => {
      mockCompare.mockResolvedValueOnce(true);
      mockHash.mockResolvedValueOnce(luisPassword);

      await activateUser(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({
        message: "User account has been activated",
      });
    });
  });
});
