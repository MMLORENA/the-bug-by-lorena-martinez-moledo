import type { NextFunction, Response } from "express";
import User from "../../../../database/models/User";
import { getMockUser } from "../../../../factories/userFactory";
import type { CustomRequest } from "../../../types";
import { getUserData } from "../userControllers";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import { userDataErrors } from "../../../../constants/errors/userErrors";

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
