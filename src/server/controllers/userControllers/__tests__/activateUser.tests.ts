import type { Request, Response } from "express";
import mongoose from "mongoose";
import { getMockUserCredentials } from "../../../../factories/userCredentialsFactory";
import User from "../../../../database/models/User";
import { activateUser } from "../userControllers";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";

const req: Partial<Request> = {};
const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn(),
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next = jest.fn();

const {
  successCodes: { okCode },
} = httpStatusCodes;

const mockPasswordHash: jest.Mock<Promise<string>> = jest.fn(async () => "");
const mockPasswordCompare: jest.Mock<Promise<boolean>> = jest.fn(
  async () => true
);

jest.mock(
  "../../../../utils/PasswordHasherBcrypt/PasswordHasherBcrypt.js",
  () =>
    jest.fn().mockImplementation(() => ({
      passwordCompare: async () => mockPasswordCompare(),
      mockPasswordHash: async () => mockPasswordHash(),
    }))
);

describe("Given an activateUser function", () => {
  describe("When it receives a request with query string activationKey and body password and confirmPassword 'test-password' and the activationKey is valid", () => {
    test("Then it should invoke response's method status with 200 and json with the message 'User account has been activated'", async () => {
      mockPasswordCompare.mockReset();

      const activationKey = new mongoose.Types.ObjectId().toString();

      req.query = {
        activationKey,
      };

      const user = getMockUserCredentials();
      const { password } = user;

      req.body = {
        password,
        confirmPassword: password,
      };

      User.findById = jest
        .fn()
        .mockResolvedValueOnce({ ...user, activationKey, save: jest.fn() });

      mockPasswordCompare.mockResolvedValueOnce(true);
      mockPasswordHash.mockResolvedValueOnce(password);

      await activateUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({
        message: "User account has been activated",
      });
    });
  });
});
