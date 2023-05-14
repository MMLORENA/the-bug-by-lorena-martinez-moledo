import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { getMockUserCredentials } from "../../../../factories/userCredentialsFactory";
import User from "../../../../database/models/User";
import { activateUser } from "../userControllers";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import { activateErrors } from "../../../../constants/errors/userErrors";

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

const mockHash: jest.Mock<Promise<string>> = jest.fn(async () => "");
const mockCompare: jest.Mock<Promise<boolean>> = jest.fn(async () => true);

jest.mock("../../../../utils/HasherBcrypt/HasherBcrypt.js", () =>
  jest.fn().mockImplementation(() => ({
    compare: async () => mockCompare(),
    hash: async () => mockHash(),
  }))
);

describe("Given an activateUser function", () => {
  describe("When it receives a request with query string activationKey and body password and confirmPassword 'test-password' and the activationKey is valid", () => {
    test("Then it should invoke response's method status with 200 and json with the message 'User account has been activated'", async () => {
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

      mockCompare.mockResolvedValueOnce(true);
      mockHash.mockResolvedValueOnce(password);

      await activateUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({
        message: "User account has been activated",
      });
    });
  });

  describe("When it receives an invalid activation key and a next function", () => {
    test("Then it should call next function with an invalid activation key error", async () => {
      const activationKey = "invalid-key";
      const invalidKeyError = activateErrors.invalidActivationKey;

      req.query = {
        activationKey,
      };

      await activateUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(invalidKeyError);
    });
  });
});
