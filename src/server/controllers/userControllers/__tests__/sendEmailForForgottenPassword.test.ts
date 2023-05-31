import type { Request, Response } from "express";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import User from "../../../../database/models/User";
import { sendEmailForForgottenPassword } from "../userControllers";
import { getMockUser } from "../../../../factories/userFactory";

const user = getMockUser();
const { email } = user;

const req: Partial<Request> = {
  body: email,
};
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

jest.mock("../../../../email/sendEmail/sendEmail.js");

describe("Given an sendEmailForForgottenPassword function", () => {
  describe("When it receives a request with a valid user email", () => {
    test("Then it should invoke response's method status with 200 and json with the message 'Email sent'", async () => {
      User.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({ ...user, save: jest.fn() }),
      });

      await sendEmailForForgottenPassword(
        req as Request,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email sent",
      });
    });
  });

  describe("When it receives a request with an inexistent user email and a next function", () => {
    test("Then it should invoke next with an error", async () => {
      const expectedError = new Error("User not found");

      User.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockRejectedValue(expectedError),
      });

      await sendEmailForForgottenPassword(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
