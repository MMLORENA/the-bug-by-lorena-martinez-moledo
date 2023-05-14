import type { Response } from "express";
import type { CustomRequest } from "../../../types";
import { getUserDetails } from "../userControllers";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";

const {
  successCodes: { okCode },
} = httpStatusCodes;

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn(),
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given a getUserDetails controller", () => {
  describe("When it receives a CustomRequest with user details id: '1234'", () => {
    test("Then it should invoke response's method status with 200 and json with with received user details", () => {
      const userDetails = {
        id: "1234",
      };

      const req: Partial<CustomRequest> = {
        userDetails,
      };

      getUserDetails(req as CustomRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({ userPayload: userDetails });
    });
  });
});
