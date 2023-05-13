import type { Request, Response } from "express";
import { logoutUser } from "../userControllers";
import config from "../../../../config";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";

const req: Partial<Request> = {};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn(),
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const {
  singleSignOnCookie: { cookieName },
} = config;

const {
  successCodes: { noContentSuccessCode },
} = httpStatusCodes;

describe("Given a logoutUser controller", () => {
  describe("When it receives a request with cookie 'coders_identity_token' and a response", () => {
    test("Then it should invoke the response's method clearCookie with 'coders_identity_token' and status with 204", () => {
      logoutUser(req as Request, res as Response);

      expect(res.clearCookie).toHaveBeenCalledWith(cookieName);
      expect(res.sendStatus).toHaveBeenCalledWith(noContentSuccessCode);
    });
  });
});
