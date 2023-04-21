import jwt from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import config from "../../../config";
import {
  mockToken,
  mockTokenPayload,
} from "../../../testUtils/mocks/mockToken";
import type { CustomRequest } from "../../types";
import auth from "./auth";
import authErrors from "../../../constants/errors/authErrors";

const {
  singleSignOnCookie: { cookieName },
} = config;

const req: Partial<CustomRequest> = {};

const res: Partial<Response> = {};

const next: NextFunction = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given the auth middleware", () => {
  const cookies = {
    [cookieName]: mockToken,
  };

  const incorrectCookies = {
    [cookieName]: "incorrect token",
  };

  describe("When it receives a request with no cookie", () => {
    test("Then it should invoke next with an error with status 401 and message 'No Token provided'", () => {
      req.cookies = {};

      auth(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(authErrors.noToken);
    });
  });

  describe("When it receives a request with a cookie that has a malformed token", () => {
    test("Then it should invoke next with a 'jwt malformed' error", () => {
      const jwtError = new Error("jwt malformed");
      const notVerifyTokenError = authErrors.generalAuthError(jwtError.message);

      jwt.verify = jest.fn().mockReturnValueOnce(jwtError);
      req.cookies = incorrectCookies;

      auth(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(notVerifyTokenError);
    });
  });

  describe("When it receives a request with a cookie that has a valid token", () => {
    test("Then it should add id, name and isAdmin to userDetails in the request", () => {
      const mockVerifyToken = mockTokenPayload;
      const { id, isAdmin, name } = mockTokenPayload;

      jwt.verify = jest.fn().mockReturnValue(mockVerifyToken);
      req.cookies = cookies;

      auth(req as CustomRequest, res as Response, next);

      expect(req.userDetails).toHaveProperty("id", id);
      expect(req.userDetails).toHaveProperty("name", name);
      expect(req.userDetails).toHaveProperty("isAdmin", isAdmin);
    });

    test("Then it should invoke next", () => {
      const mockVerifyToken = mockTokenPayload;

      jwt.verify = jest.fn().mockReturnValue(mockVerifyToken);
      req.cookies = cookies;

      auth(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
