import type { NextFunction, Response } from "express";
import User from "../../../../database/models/User";
import { getMockUser } from "../../../../factories/userFactory";
import type { CustomRequest } from "../../../types";
import { setUserNewPassword } from "../userControllers";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import { userDataErrors } from "../../../../constants/errors/userErrors";

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

let user = {
  ...getMockUser(),
  save: jest.fn().mockReturnValue(Promise.resolve()),
};

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  user = {
    ...getMockUser(),
    save: jest.fn().mockReturnValue(Promise.resolve()),
  };
});

describe("Given a setUserNewPassword controller", () => {
  const req: Partial<CustomRequest> = {
    userDetails: {
      id: user._id,
    },
    body: {
      password: "password",
    },
  };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  describe("When it receives a request with user id '1234' and new password 'password'", () => {
    beforeEach(() => {
      User.findById = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValueOnce(user),
      }));
    });

    test("Then the user should have the new password hashed", async () => {
      const hashedPassword = "hashed-password";

      mockHash.mockResolvedValueOnce(hashedPassword);

      await setUserNewPassword(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(user).toHaveProperty("password", hashedPassword);
    });

    test("Then it should invoke response's method status with 200 and json with message 'User's new password has been set'", async () => {
      const expectedResponseMessage = "User's new password has been set";

      const req: Partial<CustomRequest> = {
        userDetails: {
          id: user._id,
        },
        body: {
          password: "password",
        },
      };

      await setUserNewPassword(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({
        message: expectedResponseMessage,
      });
    });

    describe("And the user is inactive and has no password", () => {
      test("Then the user should be activated", async () => {
        const userWithoutPassword = {
          ...user,
          password: "",
        };

        // eslint-disable-next-line max-nested-callbacks
        User.findById = jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValueOnce(userWithoutPassword),
        }));

        await setUserNewPassword(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(userWithoutPassword).toHaveProperty("isActive", true);
      });
    });
  });

  describe("When it receives a request with an inexistent user id '1234' and a next function", () => {
    test("Then it should call next with a user not found error", async () => {
      User.findById = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValueOnce(null),
      }));

      await setUserNewPassword(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(userDataErrors.userDataNotFound);
    });
  });
});
