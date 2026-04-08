import { eq, desc, sql, and, gte, lte, inArray, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  vehicles, VehicleInsert, VehicleSelect,
  vehicleImages, VehicleImageInsert,
  appraisalSubmissions, AppraisalInsert,
  appraisalImages, AppraisalImageInsert,
  contactSubmissions, ContactInsert,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== USER QUERIES =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== VEHICLE QUERIES =====

export async function listVehicles(filters?: {
  series?: string[];
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  location?: string;
  isActive?: boolean;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(vehicles.isActive, 1)];

  if (filters?.series && filters.series.length > 0) {
    conditions.push(inArray(vehicles.series, filters.series));
  }
  if (filters?.priceMin !== undefined) {
    conditions.push(gte(vehicles.price, filters.priceMin));
  }
  if (filters?.priceMax !== undefined) {
    conditions.push(lte(vehicles.price, filters.priceMax));
  }
  if (filters?.yearMin !== undefined) {
    conditions.push(gte(vehicles.year, filters.yearMin));
  }
  if (filters?.yearMax !== undefined) {
    conditions.push(lte(vehicles.year, filters.yearMax));
  }
  if (filters?.mileageMin !== undefined) {
    conditions.push(gte(vehicles.mileage, filters.mileageMin));
  }
  if (filters?.mileageMax !== undefined) {
    conditions.push(lte(vehicles.mileage, filters.mileageMax));
  }
  if (filters?.location) {
    conditions.push(eq(vehicles.location, filters.location));
  }

  return db.select().from(vehicles).where(and(...conditions)).orderBy(desc(vehicles.createdAt));
}

export async function getVehicleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  if (result.length === 0) return undefined;

  // Also fetch images
  const images = await db.select().from(vehicleImages)
    .where(eq(vehicleImages.vehicleId, id))
    .orderBy(vehicleImages.sortOrder);

  return { ...result[0], images };
}

export async function createVehicle(data: VehicleInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(vehicles).values(data);
  // Return the inserted ID
  const insertId = (result as any)[0]?.insertId;
  return { insertId };
}

export async function updateVehicle(id: number, data: Partial<VehicleInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(vehicles).set(data).where(eq(vehicles.id, id));
}

export async function deleteVehicle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Also delete images
  await db.delete(vehicleImages).where(eq(vehicleImages.vehicleId, id));
  await db.delete(vehicles).where(eq(vehicles.id, id));
}

export async function getAllVehiclesAdmin() {
  const db = await getDb();
  if (!db) return [];

  const allVehicles = await db.select().from(vehicles).orderBy(desc(vehicles.createdAt));

  // Fetch images for each vehicle
  const vehicleIds = allVehicles.map(v => v.id);
  if (vehicleIds.length === 0) return [];

  const allImages = await db.select().from(vehicleImages)
    .where(inArray(vehicleImages.vehicleId, vehicleIds))
    .orderBy(vehicleImages.sortOrder);

  return allVehicles.map(v => ({
    ...v,
    images: allImages.filter(img => img.vehicleId === v.id),
  }));
}

// ===== VEHICLE IMAGE QUERIES =====

export async function addVehicleImage(data: VehicleImageInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(vehicleImages).values(data);
  const insertId = (result as any)[0]?.insertId;
  return { insertId };
}

export async function deleteVehicleImage(imageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(vehicleImages).where(eq(vehicleImages.id, imageId));
}

export async function getVehicleImages(vehicleId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(vehicleImages)
    .where(eq(vehicleImages.vehicleId, vehicleId))
    .orderBy(vehicleImages.sortOrder);
}

export async function reorderVehicleImages(vehicleId: number, imageIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  for (let i = 0; i < imageIds.length; i++) {
    await db.update(vehicleImages)
      .set({ sortOrder: i })
      .where(and(eq(vehicleImages.id, imageIds[i]), eq(vehicleImages.vehicleId, vehicleId)));
  }

  // Update main vehicle imageUrl to first image
  const firstImage = await db.select().from(vehicleImages)
    .where(eq(vehicleImages.vehicleId, vehicleId))
    .orderBy(vehicleImages.sortOrder)
    .limit(1);

  if (firstImage.length > 0) {
    await db.update(vehicles).set({ imageUrl: firstImage[0].imageUrl }).where(eq(vehicles.id, vehicleId));
  }
}

// ===== APPRAISAL QUERIES =====

export async function createAppraisal(data: AppraisalInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(appraisalSubmissions).values(data);
  return { id: result[0].insertId };
}

export async function addAppraisalImage(data: AppraisalImageInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(appraisalImages).values(data);
}

export async function getAppraisalImages(appraisalId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(appraisalImages).where(eq(appraisalImages.appraisalId, appraisalId));
}

export async function listAppraisals() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(appraisalSubmissions).orderBy(desc(appraisalSubmissions.createdAt));
}

export async function updateAppraisalStatus(id: number, status: "pending" | "contacted" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(appraisalSubmissions).set({ status }).where(eq(appraisalSubmissions.id, id));
}

// ===== CONTACT QUERIES =====

export async function createContact(data: ContactInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(contactSubmissions).values(data);
}

export async function listContacts() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
}

export async function updateContactStatus(id: number, status: "pending" | "contacted" | "completed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(contactSubmissions).set({ status }).where(eq(contactSubmissions.id, id));
}
