import { luisEmail } from "../../../testUtils/mocks/mockUsers";
import User from "../../../database/models/User";
import checkActivationKey from "./checkActivationKey";
import {
  loginErrors,
  activateErrors,
} from "../../../constants/errors/userErrors";
import { getMockUser } from "../../../factories/userFactory";
import type { ActivationKeyRequest } from "../../types";
import type { Response } from "express";
import type Hasher from "../../../utils/HasherBcrypt/Hasher";

const userCredentials = getMockUser({ email: luisEmail });

const req: Partial<ActivationKeyRequest> = {
  params: {
    email: userCredentials.email,
    activationKey: userCredentials.activationKey,
  },
};

const res: Partial<Response> = {};

const next = jest.fn();

const mockCompare: jest.Mock<Promise<boolean>> = jest.fn(async () => true);

jest.mock("../../../utils/HasherBcrypt/HasherBcrypt", () =>
  jest.fn().mockImplementation(() => ({
    ...jest.requireActual<Hasher>("../../../utils/HasherBcrypt/HasherBcrypt"),
    compare: async () => mockCompare(),
  }))
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given the checkActivationKey middleware", () => {
  describe("When it receives a request with the email 'luisito@isdicoders.com' and the user does not exist", () => {
    test("Then it should invoke next with an error with status 401 and message 'User not found'", async () => {
      User.findOne = jest.fn().mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await checkActivationKey(
        req as ActivationKeyRequest,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(loginErrors.userNotFound);
    });
  });

  describe("When it receives a request with an email from an existing user and an invalid activation key", () => {
    test("Then it should invoke next with an error with status 401 and message 'Invalid activation key'", async () => {
      const activationKey = "invalid-key";
      const existingUserWithInvalidActivationkey = getMockUser({
        ...userCredentials,
      });

      mockCompare.mockResolvedValueOnce(false);

      const req: Partial<ActivationKeyRequest> = {
        params: {
          email: userCredentials.email,
          activationKey,
        },
      };

      User.findOne = jest.fn().mockReturnValueOnce({
        exec: jest
          .fn()
          .mockResolvedValueOnce(existingUserWithInvalidActivationkey),
      });

      await checkActivationKey(
        req as ActivationKeyRequest,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(activateErrors.invalidActivationKey);
    });
  });

  describe("When it receives a request with the email 'luisito@isdicoders.com', the user exists and it has a valid activation key", () => {
    test("Then it should add the user id to userDetails in the request ", async () => {
      const existingUser = getMockUser({
        ...userCredentials,
      });
      User.findOne = jest.fn().mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(existingUser),
      });

      await checkActivationKey(
        req as ActivationKeyRequest,
        res as Response,
        next
      );

      expect(req.userDetails).toHaveProperty("id", existingUser._id);
    });

    test("Then it should invoke next", async () => {
      const existingUser = getMockUser({
        ...userCredentials,
      });
      User.findOne = jest.fn().mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(existingUser),
      });

      await checkActivationKey(
        req as ActivationKeyRequest,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith();
    });
  });
});
