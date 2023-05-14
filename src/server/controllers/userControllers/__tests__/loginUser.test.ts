import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getMockUserCredentials } from "../../../../factories/userCredentialsFactory";
import { luisEmail } from "../../../../testUtils/mocks/mockUsers";
import User from "../../../../database/models/User";
import { loginUser } from "../userControllers";
import { loginErrors } from "../../../../constants/errors/userErrors";
import { getMockUser } from "../../../../factories/userFactory";
import { generateMockToken } from "../../../../testUtils/mocks/mockToken";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import config from "../../../../config";

const {
  successCodes: { okCode },
} = httpStatusCodes;

const {
  singleSignOnCookie: { cookieMaxAge, cookieName },
} = config;

const req: Partial<Request> = {};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn(),
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

const mockCompare: jest.Mock<Promise<boolean>> = jest.fn(async () => true);

jest.mock("../../../../utils/HasherBcrypt/HasherBcrypt.js", () =>
  jest.fn().mockImplementation(() => ({
    compare: async () => mockCompare(),
  }))
);

describe("Given a loginUser controller", () => {
  const userCredentials = getMockUserCredentials({ email: luisEmail });

  describe("When it receives a request with email 'luisito@isdicoders.com' and the user doesn't exist, and a next function", () => {
    test("Then next should be invoked with message 'User not found', status 401 and public message 'Incorrect email or password'", async () => {
      req.body = userCredentials;

      User.findOne = jest.fn().mockResolvedValueOnce(null);

      await loginUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(loginErrors.userNotFound);
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com' and password 'luisito' and the password is incorrect, and a next function", () => {
    test("Then next should be invoked with message 'Incorrect password', status code 401 and public message 'Incorrect email or password'", async () => {
      const incorrectPassword = "luisito";
      const incorrectUserCredentials = {
        ...userCredentials,
        password: incorrectPassword,
      };
      req.body = incorrectUserCredentials;

      User.findOne = jest.fn().mockResolvedValueOnce(incorrectUserCredentials);
      mockCompare.mockResolvedValueOnce(false);

      await loginUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(loginErrors.incorrectPassword);
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com', a correct password and the user exists and is active", () => {
    test("Then it should invoke the response's status method with 200 and json with a token", async () => {
      req.body = userCredentials;

      const existingUser = getMockUser({ ...userCredentials, isActive: true });
      const existingUserMockToken = generateMockToken({ id: existingUser._id });

      User.findOne = jest.fn().mockResolvedValueOnce(existingUser);

      mockCompare.mockResolvedValueOnce(true);

      jwt.sign = jest.fn().mockReturnValueOnce(existingUserMockToken);

      await loginUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.cookie).toHaveBeenCalledWith(
        cookieName,
        existingUserMockToken,
        {
          httpOnly: true,
          maxAge: cookieMaxAge,
          sameSite: "none",
          secure: true,
        }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "coders_identity_token has been set",
      });
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com', a correct password and the password is correct and the user exists but is inactive", () => {
    test("Then it should invoke next with message 'User is inactive', status 401 and public message 'User is inactive, contact your administrator if you think this is a mistake'", async () => {
      req.body = userCredentials;
      const existingUser = getMockUser(userCredentials);

      User.findOne = jest.fn().mockResolvedValueOnce(existingUser);

      mockCompare.mockResolvedValueOnce(true);

      await loginUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(loginErrors.inactiveUser);
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com', a password and bcrypt rejects, and a next function", () => {
    test("Then it should invoke next with the error thrown by bcrypt", async () => {
      const bcryptError = new Error();

      req.body = userCredentials;

      User.findOne = jest.fn().mockResolvedValueOnce(userCredentials);
      mockCompare.mockRejectedValueOnce(bcryptError);

      await loginUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(bcryptError);
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com' no password, and a next function", () => {
    test("Then next should be invoked with message 'Incorrect password', status code 401 and public message 'Incorrect email or password'", async () => {
      const incorrectUserCredentials = {
        ...userCredentials,
        password: "",
      };
      req.body = incorrectUserCredentials;

      User.findOne = jest.fn().mockResolvedValueOnce(incorrectUserCredentials);
      mockCompare.mockRejectedValueOnce(false);

      await loginUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(loginErrors.incorrectPassword);
    });
  });
});
