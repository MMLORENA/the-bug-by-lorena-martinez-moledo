import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { environment } from "../../environment/loadEnvironments.js";
import type { CustomTokenPayload } from "../../server/types.js";

const {
  jwt: { jwtSecret },
} = environment;

export const mockTokenPayload: CustomTokenPayload = {
  id: new mongoose.Types.ObjectId().toString(),
};

export const generateMockToken = (payload = mockTokenPayload): string =>
  jwt.sign(payload, jwtSecret);
