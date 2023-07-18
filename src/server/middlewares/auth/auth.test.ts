import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../../config";
import authErrors from "../../../constants/errors/authErrors";
import User from "../../../database/models/User";
import { getMockUser } from "../../../factories/userFactory";
import {
  generateMockToken,
  mockTokenPayload,
} from "../../../testUtils/mocks/mockToken";
import type { CustomRequest } from "../../types";
import { auth, checkIsUserAdmin } from "./auth";

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
    [cookieName]: generateMockToken(),
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

      jwt.verify = jest.fn().mockImplementation(() => {
        throw notVerifyTokenError;
      });

      req.cookies = incorrectCookies;

      auth(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(notVerifyTokenError);
    });
  });

  describe("When it receives a request with a cookie that has a valid token", () => {
    test("Then it should add the user id to userDetails in the request", () => {
      const { id } = mockTokenPayload;

      jwt.verify = jest.fn().mockReturnValue(mockTokenPayload);
      req.cookies = cookies;

      auth(req as CustomRequest, res as Response, next);

      expect(req.userDetails).toHaveProperty("id", id);
    });

    test("Then it should invoke next", () => {
      jwt.verify = jest.fn().mockReturnValue(mockTokenPayload);
      req.cookies = cookies;

      auth(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given checkIsUserAdmin middleware", () => {
  const mockUser = getMockUser({ _id: "1", isAdmin: true });

  describe("When it's receives a request with userId: '1' who is admin and next function", () => {
    test("Then it should invoke next function", async () => {
      User.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      await checkIsUserAdmin(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    describe("When it's receives a request with userId: '1' who is not an admin and next function", () => {
      test("Then it should invoke next function with error 'Forbidden'", async () => {
        User.findById = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({ ...mockUser, isAdmin: false }),
        });

        await checkIsUserAdmin(req as CustomRequest, res as Response, next);

        expect(next).toHaveBeenCalledWith(authErrors.userIsNotAdmin);
      });
    });
  });
});
