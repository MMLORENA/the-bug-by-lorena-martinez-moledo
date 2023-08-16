import type { NextFunction, Request, Response } from "express";
import User from "../../../../database/models/User";
import { registerUser } from "../userControllers";
import { getMockUserData } from "../../../../factories/userDataFactory";
import { luisEmail } from "../../../../testUtils/mocks/mockUsers";
import type { UserWithId } from "../../../types";
import { getMockUser } from "../../../../factories/userFactory";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import { registerErrors } from "../../../../constants/errors/userErrors";

const {
  successCodes: { createdCode },
} = httpStatusCodes;

const req: Partial<Request> = {};

afterEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn(),
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

const mockHash: jest.Mock<Promise<string>> = jest.fn(async () => "");

jest.mock("../../../../utils/HasherBcrypt/HasherBcrypt.js", () =>
  jest.fn().mockImplementation(() => ({
    hash: async () => mockHash(),
  }))
);

jest.mock("../../../../email/sendEmail/sendEmail.js");

describe("Given a registerUser Controller", () => {
  const registerUserBody = getMockUserData({ email: luisEmail });

  describe("When it receives a request with a user data with email: 'luisito@isdicoders.com'", () => {
    test("Then it should call the response method status with a 201, and method json with a user with email 'luisito@isdicoders.com", async () => {
      const userCreatedMock: UserWithId = getMockUser(registerUserBody);
      const expectedStatus = createdCode;

      req.body = registerUserBody;

      User.create = jest
        .fn()
        .mockReturnValueOnce({ ...userCreatedMock, save: jest.fn() });

      mockHash.mockResolvedValueOnce("mock activation key");

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: userCreatedMock._id,
          name: userCreatedMock.name,
          email: userCreatedMock.email,
        },
      });
    });
  });

  describe("When it receives a request with a user name that already exist", () => {
    test("Then it should call next with an error message 'Duplicate key'", async () => {
      const errorDuplicateKeyMessage = "duplicate key";
      const duplicateKeyError = registerErrors.duplicateUser(
        errorDuplicateKeyMessage
      );

      User.create = jest.fn().mockRejectedValue(duplicateKeyError);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(duplicateKeyError);
    });
  });

  describe("When it receives a request with a valid user name and email and there's is an error saving the user to database", () => {
    test("Then it should call next with an error message 'Error creating a new user'", async () => {
      const expectedGeneralError = registerErrors.generalRegisterError();
      const userCreatedMock: UserWithId = getMockUser(registerUserBody);

      req.body = registerUserBody;

      User.create = jest.fn().mockReturnValueOnce({
        ...userCreatedMock,
        save: jest.fn().mockRejectedValue(new Error()),
      });

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedGeneralError);
    });
  });
});
