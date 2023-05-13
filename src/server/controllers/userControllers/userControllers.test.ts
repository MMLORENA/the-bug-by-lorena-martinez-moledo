import type { NextFunction, Request, Response } from "express";
import config from "../../../config.js";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import User from "../../../database/models/User.js";
import { getMockUser } from "../../../factories/userFactory.js";
import type { CustomRequest } from "../../types.js";
import { getUserData, logoutUser } from "./userControllers.js";
import { userDataErrors } from "../../../constants/errors/userErrors.js";

const mockPasswordHash: jest.Mock<string> = jest.fn(() => "");
const mockPasswordCompare: jest.Mock<boolean | Promise<Error>> = jest.fn(
  () => true
);

jest.mock("../../../utils/PasswordHasherBcrypt/PasswordHasherBcrypt.js", () =>
  jest.fn().mockImplementation(() => ({
    passwordHash: () => mockPasswordHash(),
    passwordCompare: () => mockPasswordCompare(),
  }))
);

jest.mock("../../../email/sendEmail/sendEmail.js");

const {
  successCodes: { okCode, noContentSuccessCode },
} = httpStatusCodes;

const {
  singleSignOnCookie: { cookieName },
} = config;

beforeEach(() => {
  jest.clearAllMocks();
});

const req: Partial<Request> = {};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn(),
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a logoutUser controller", () => {
  describe("When it receives a request with cookie 'coders_identity_token' and a response", () => {
    test("Then it should invoke the response's method clearCookie with 'coders_identity_token' and status with 204", () => {
      logoutUser(req as Request, res as Response);

      expect(res.clearCookie).toHaveBeenCalledWith(cookieName);
      expect(res.sendStatus).toHaveBeenCalledWith(noContentSuccessCode);
    });
  });
});

describe("Given a getUserData controller", () => {
  const user = getMockUser({
    _id: "1234",
  });

  const req: Partial<CustomRequest> = {
    userDetails: {
      id: user._id,
    },
  };

  describe("When it receives a custom request with user details id: '1234' and the user exists", () => {
    test("Then it should invoke response's method status with 200 and json with received user data", async () => {
      User.findById = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValueOnce(user),
      }));

      await getUserData(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({
        user: { name: user.name, email: user.email, isAdmin: user.isAdmin },
      });
    });
  });

  describe("When it receives a custom request with user details id: '1234' and the user doesn't exists", () => {
    test("Then it should invoke next with the error not found user with message 'User data not available'", async () => {
      User.findById = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValueOnce(null),
      }));

      await getUserData(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(userDataErrors.userDataNotFound);
    });
  });
});
