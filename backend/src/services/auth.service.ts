import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AppError } from "../common/errors";
import { env } from "../config/env";
import { AuthTokenPayload } from "../types/auth";
import { Role, User, UserSettings } from "../types/domain";
import { prisma } from "../lib/prisma";

interface AuthResult {
  user: Omit<User, "passwordHash">;
  accessToken: string;
  refreshToken: string;
}

const mapPrismaUser = (dbUser: any): User => {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role as Role,
    passwordHash: dbUser.passwordHash,
    status: dbUser.status as any,
    profileCompletion: dbUser.profileCompletion,
    createdAt: dbUser.createdAt.toISOString(),
    updatedAt: dbUser.updatedAt.toISOString(),
    settings: {
      emailNotifications: dbUser.settings?.emailNotifications ?? true,
      marketingEmails: dbUser.settings?.marketingEmails ?? false,
      darkMode: dbUser.settings?.darkMode ?? false,
    },
  };
};

const stripSecretFields = (user: User): Omit<User, "passwordHash"> => {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
};

const signToken = (
  payload: AuthTokenPayload,
  secret: string,
  expiresIn: string,
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
};

const generateTokens = async (
  user: User,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = signToken(
    { sub: user.id, role: user.role, type: "access" },
    env.jwtAccessSecret,
    env.accessTokenTtl,
  );

  const refreshToken = signToken(
    { sub: user.id, role: user.role, type: "refresh" },
    env.jwtRefreshSecret,
    env.refreshTokenTtl,
  );

  // Figure out expiresAt from JWT TTL
  const isDays = env.refreshTokenTtl.endsWith("d");
  const ttlInt = parseInt(env.refreshTokenTtl, 10);
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + (isDays ? ttlInt * 24 * 60 * 60 * 1000 : ttlInt * 1000),
  );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
};

export const authService = {
  async signup(params: {
    name: string;
    email: string;
    password: string;
    role: Role;
    companyName?: string;
  }): Promise<AuthResult> {
    const existing = await prisma.user.findUnique({
      where: { email: params.email.toLowerCase() },
    });

    if (existing) {
      throw new AppError(409, "Email already registered", "EMAIL_EXISTS");
    }

    const passwordHash = await bcrypt.hash(params.password, 10);

    // Default data to populate seeker or company profile
    const profileCompletion = params.role === "company" ? 40 : 55;

    const dbUser = await prisma.user.create({
      data: {
        name: params.name,
        email: params.email.toLowerCase(),
        role: params.role,
        passwordHash,
        profileCompletion,
        settings: {
          create: {
            emailNotifications: true,
            marketingEmails: false,
            darkMode: false,
          },
        },
        ...(params.role === "seeker" ? { seekerProfile: { create: {} } } : {}),
        ...(params.role === "company"
          ? {
              companyProfile: {
                create: { name: params.companyName || params.name },
              },
            }
          : {}),
      },
      include: {
        settings: true,
      },
    });

    const user = mapPrismaUser(dbUser);
    const tokens = await generateTokens(user);

    return {
      user: stripSecretFields(user),
      ...tokens,
    };
  },

  async login(params: {
    email: string;
    password: string;
    role?: Role;
  }): Promise<AuthResult> {
    const dbUser = await prisma.user.findUnique({
      where: { email: params.email.toLowerCase() },
      include: { settings: true },
    });

    if (!dbUser) {
      throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    if (dbUser.status !== "active") {
      throw new AppError(403, "Account is suspended", "ACCOUNT_SUSPENDED");
    }

    if (params.role && dbUser.role !== params.role) {
      throw new AppError(403, "Role mismatch", "ROLE_MISMATCH");
    }

    const isValid = await bcrypt.compare(params.password, dbUser.passwordHash);
    if (!isValid) {
      throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const user = mapPrismaUser(dbUser);
    const tokens = await generateTokens(user);
    return {
      user: stripSecretFields(user),
      ...tokens,
    };
  },

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new AppError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN");
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
      throw new AppError(401, "Refresh token expired", "EXPIRED_REFRESH_TOKEN");
    }

    try {
      const payload = jwt.verify(
        refreshToken,
        env.jwtRefreshSecret,
      ) as AuthTokenPayload;

      if (payload.type !== "refresh") {
        throw new AppError(
          401,
          "Invalid refresh token",
          "INVALID_REFRESH_TOKEN",
        );
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: payload.sub },
        include: { settings: true },
      });

      if (!dbUser) {
        throw new AppError(404, "User not found", "USER_NOT_FOUND");
      }

      const user = mapPrismaUser(dbUser);
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
      return await generateTokens(user);
    } catch {
      await prisma.refreshToken
        .delete({ where: { token: refreshToken } })
        .catch(() => {});
      throw new AppError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN");
    }
  },

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  },

  async getMe(userId: string): Promise<Omit<User, "passwordHash">> {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!dbUser) {
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }

    return stripSecretFields(mapPrismaUser(dbUser));
  },

  async updatePassword(
    userId: string,
    currentPassword: string,
    nextPassword: string,
  ): Promise<void> {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) throw new AppError(404, "User not found", "USER_NOT_FOUND");

    const isValid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!isValid) {
      throw new AppError(
        401,
        "Current password is incorrect",
        "INVALID_CREDENTIALS",
      );
    }

    const newHash = await bcrypt.hash(nextPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });
  },

  async updateSettings(
    userId: string,
    patch: Partial<UserSettings>,
  ): Promise<Omit<User, "passwordHash">> {
    const dbUser = await prisma.user.update({
      where: { id: userId },
      data: {
        settings: {
          upsert: {
            create: {
              emailNotifications: patch.emailNotifications ?? true,
              marketingEmails: patch.marketingEmails ?? false,
              darkMode: patch.darkMode ?? false,
            },
            update: {
              ...(patch.emailNotifications !== undefined
                ? { emailNotifications: patch.emailNotifications }
                : {}),
              ...(patch.marketingEmails !== undefined
                ? { marketingEmails: patch.marketingEmails }
                : {}),
              ...(patch.darkMode !== undefined
                ? { darkMode: patch.darkMode }
                : {}),
            },
          },
        },
      },
      include: { settings: true },
    });

    return stripSecretFields(mapPrismaUser(dbUser));
  },
};
