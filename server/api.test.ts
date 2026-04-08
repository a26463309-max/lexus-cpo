import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "normal-user",
    email: "user@example.com",
    name: "Normal User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user data for authenticated users", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.name).toBe("Admin User");
    expect(result?.role).toBe("admin");
  });
});

describe("admin access control", () => {
  it("rejects non-admin users from admin endpoints", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.vehicles.list()).rejects.toThrow();
  });

  it("rejects unauthenticated users from admin endpoints", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.vehicles.list()).rejects.toThrow();
  });
});

describe("contact form validation", () => {
  it("rejects contact submission with missing required fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.contact.submit({
        name: "",
        phone: "0912345678",
      })
    ).rejects.toThrow();
  });
});

describe("appraisal form validation", () => {
  it("rejects appraisal submission with missing required fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.appraisal.submit({
        name: "",
        phone: "0912345678",
        brand: "LEXUS",
        model: "RX",
        year: "2022",
        mileage: "50000",
        relation: "本人",
      })
    ).rejects.toThrow();
  });
});
