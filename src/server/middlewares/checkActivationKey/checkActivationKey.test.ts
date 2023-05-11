import type { SetPasswordRequest } from "../../types";
import { luisEmail } from "../../../testUtils/mocks/mockUsers";
import User from "../../../database/models/User";
import checkActivationKey from "./checkActivationKey";
import {
  loginErrors,
  activateErrors,
} from "../../../constants/errors/userErrors";
import { getMockUser } from "../../../factories/userFactory";

const userCredentials = getMockUser({ email: luisEmail });

const req: Partial<
  SetPasswordRequest<Record<string, unknown>, Record<string, unknown>>
> = {
  params: {
    email: userCredentials.email,
    activationKey: userCredentials.activationKey,
  },
};

const res: Partial<Response> = {};

const next = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given the checkActivationKey middleware", () => {
  describe("When it receives a request with the email 'luisito@isdicoders.com' and the user does not exist", () => {
    test("Then it should invoke next with an error with status 401 and message 'User not found'", async () => {
      User.findOne = jest.fn().mockReturnValueOnce(null);

      await checkActivationKey(
        req as SetPasswordRequest,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(loginErrors.userNotFound);
    });
  });

  describe("When it receives a request with the email 'luisito@isdicoders.com', the user exist and it has an invalid activation key", () => {
    test("Then it should invoke next with an error with status 401 and message 'Invalid activation key'", async () => {
      const activationKey = "";
      const existingUserWithInvalidActivationkey = getMockUser({
        ...userCredentials,
        activationKey,
      });

      User.findOne = jest
        .fn()
        .mockReturnValueOnce(existingUserWithInvalidActivationkey);

      await checkActivationKey(
        req as SetPasswordRequest,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(activateErrors.invalidActivationKey);
    });
  });

  describe("When it receives a request with the email 'luisito@isdicoders.com', the user exist and it has a valid activation key that it is not the same as the one in the data base", () => {
    test("Then it should invoke next with an error with status 401 and message 'Invalid activation key'", async () => {
      const activationKey = "mocked-activation-key";
      const existingUserWithInvalidActivationkey = getMockUser({
        ...userCredentials,
        activationKey,
      });

      User.findOne = jest
        .fn()
        .mockReturnValueOnce(existingUserWithInvalidActivationkey);

      await checkActivationKey(
        req as SetPasswordRequest,
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
      User.findOne = jest.fn().mockReturnValueOnce(existingUser);

      await checkActivationKey(
        req as SetPasswordRequest,
        res as Response,
        next
      );

      expect(req.userDetails).toHaveProperty("id", existingUser._id);
    });

    test("Then it should invoke next", async () => {
      const existingUser = getMockUser({
        ...userCredentials,
      });
      User.findOne = jest.fn().mockReturnValueOnce(existingUser);

      await checkActivationKey(
        req as SetPasswordRequest,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith();
    });
  });
});
