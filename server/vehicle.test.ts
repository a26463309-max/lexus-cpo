import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("vehicle.list", () => {
  it("returns an array of vehicles", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicle.list({});
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns vehicles with required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicle.list({});
    if (result.length > 0) {
      const vehicle = result[0];
      expect(vehicle).toHaveProperty("id");
      expect(vehicle).toHaveProperty("model");
      expect(vehicle).toHaveProperty("series");
      expect(vehicle).toHaveProperty("price");
      expect(vehicle).toHaveProperty("year");
      expect(vehicle).toHaveProperty("mileage");
    }
  });

  it("filters by series when provided", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicle.list({ series: ["NX"] });
    for (const v of result) {
      expect(v.series).toBe("NX");
    }
  });
});

describe("vehicle.getById", () => {
  it("returns undefined for non-existent vehicle", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.vehicle.getById({ id: 999999 });
    expect(result).toBeUndefined();
  });

  it("returns vehicle with images array when found", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First get a list to find a valid ID
    const list = await caller.vehicle.list({});
    if (list.length > 0) {
      const vehicle = await caller.vehicle.getById({ id: list[0].id });
      expect(vehicle).toBeDefined();
      expect(vehicle!.id).toBe(list[0].id);
      expect(vehicle).toHaveProperty("images");
      expect(Array.isArray(vehicle!.images)).toBe(true);
    }
  });
});
