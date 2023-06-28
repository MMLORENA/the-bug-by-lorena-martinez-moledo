import type { Request } from "express";
import type * as core from "express-serve-static-core";
import type { JwtPayload } from "jsonwebtoken";

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserActivationCredentials
  extends Pick<UserCredentials, "password"> {
  confirmPassword: string;
}

export type UserPassword = Pick<UserCredentials, "password">;

export type UserEmail = Pick<UserCredentials, "email">;

export interface UserData extends Omit<UserCredentials, "password"> {
  name: string;
}

export interface UserStructure
  extends UserData,
    Pick<UserCredentials, "password"> {
  isAdmin: boolean;
  isActive: boolean;
  activationKey?: string;
  activationKeyExpiry?: Date;
}

export interface CustomTokenPayload extends JwtPayload {
  id: string;
}

export interface UserWithId extends UserStructure {
  _id: string;
}

export interface UserDetails {
  id: string;
}

export interface CustomRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userDetails: UserDetails;
}

export type ActivationKeyRequest = CustomRequest<
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>,
  {
    email: string;
    activationKey: string;
  }
>;
