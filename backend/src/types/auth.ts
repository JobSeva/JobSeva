import { Request } from "express";

import { Role } from "./domain";

export interface AuthTokenPayload {
  sub: string;
  role: Role;
  type: "access" | "refresh";
}

export interface AuthContext {
  userId: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  auth?: AuthContext;
}
